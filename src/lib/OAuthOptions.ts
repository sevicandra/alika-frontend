import "server-only";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { encrypt, verify, decrypt } from "./jwt";
import { Mutex } from "async-mutex";
import { cache } from "react";
const userLocks = new Map<string, Mutex>();
async function getUserMutex(userId: string) {
  if (!userLocks.has(userId)) {
    userLocks.set(userId, new Mutex());
  }
  return userLocks.get(userId)!;
}

const {
  AUTH_BASE_URI,
  AUTH_BASE_URI_INTERNAL,
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  AUTH_REDIRECT_URI,
  AUTH_TOKEN_ENDPOINT,
  AUTH_GRANT_TYPE,
  AUTH_SCOPE,
} = process.env;


export class OAuth2 {
  private static async getUser() {
    const token = (await cookies()).get(
      `${process.env.APP_NAME}.session`
    )?.value;
    if (!token) {
      return null;
    }
    return token;
  }

  private static async getRefreshToken() {
    const refresh_token = (await cookies()).get(
      `${process.env.APP_NAME}.refresh_token`
    )?.value;
    if (!refresh_token) {
      return null;
    }
    return refresh_token;
  }
  static async callback(req: NextRequest) {
    try {
      const code = new URL(req.url).searchParams.get("code");
      const res = await fetch(
        `${AUTH_BASE_URI_INTERNAL ?? AUTH_BASE_URI}/${AUTH_TOKEN_ENDPOINT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: AUTH_CLIENT_ID ?? "",
            client_secret: AUTH_CLIENT_SECRET ?? "",
            redirect_uri: AUTH_REDIRECT_URI ?? "",
            code: code ?? "",
            grant_type: AUTH_GRANT_TYPE ?? "",
          }),
          cache: "no-store",
        }
      );
      if (!res.ok) {
        const message = await res.json();
        throw new Error(message);
      }
      const { access_token, refresh_token, expires_in } = await res.json();
      (await cookies()).set(`${process.env.APP_NAME}.session`, access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        path: "/",
        sameSite: "lax",
        maxAge: expires_in,
      });
      (await cookies()).set(
        `${process.env.APP_NAME ?? "FRONTEND"}.refresh_token`,
        refresh_token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" ? true : false,
          path: "/",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
        }
      );
      return NextResponse.redirect(new URL(`${process.env.APP_URL}`, req.url));
    } catch (error: any) {
      return NextResponse.json(
        { status: "failed", message: error.message },
        { status: 500 }
      );
    }
  }

  static async refreshToken({
    refresh_token,
  }: {
    refresh_token: string;
  }): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const { token } = await verify(refresh_token);
        if (!token) {
          throw new Error("Refresh token not found");
        }
        const response = await fetch(
          `${AUTH_BASE_URI_INTERNAL ?? AUTH_BASE_URI}/${AUTH_TOKEN_ENDPOINT}`,
          {
            method: "POST",
            body: new URLSearchParams({
              client_id: AUTH_CLIENT_ID ?? "",
              client_secret: AUTH_CLIENT_SECRET ?? "",
              redirect_uri: AUTH_REDIRECT_URI ?? "",
              refresh_token: refresh_token,
              grant_type: "refresh_token",
              scope: AUTH_SCOPE ?? "",
            }),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message);
        } else {
          const { access_token, refresh_token, expires_in } =
            await response.json();
          (await cookies()).set(
            `${process.env.APP_NAME}.session`,
            access_token,
            {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production" ? true : false,
              path: "/",
              sameSite: "lax",
              maxAge: expires_in,
            }
          );
          (await cookies()).set(
            `${process.env.APP_NAME}.refresh_token`,
            refresh_token,
            {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production" ? true : false,
              path: "/",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 30,
            }
          );
          resolve();
        }
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  static async session(req: NextRequest): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const token = (await this.getUser()) ?? "";
      const user = await verify(token).catch(() => null);
      if (!user) {
        const refresh_token = await this.getRefreshToken();
        if (!refresh_token) {
          reject("Unauthorized");
        } else {
          const mutex = await getUserMutex(refresh_token);
          const isInitiator = !mutex.isLocked();
          const release = await mutex.acquire();
          try {
            if (isInitiator) {
              await this.refreshToken({ refresh_token });
            }
            reject("Token expired");
          } catch (error) {
            console.error("Error refreshing token:", error);
            (await cookies()).delete(`${process.env.APP_NAME}.session`);
            (await cookies()).delete(`${process.env.APP_NAME}.refresh_token`);
            reject("Unauthorized");
          } finally {
            setTimeout(() => {
              release();
            }, 100);
          }
        }
      } else {
        resolve({
          user: {
            sub: user.sub,
            name: user.name,
            nik: user.nik,
            nip: user.nip,
            kode_satker: user.kode_satker,
            satker: user.satker,
            gravatar: user.gravatar,
          },
          globalRoles: user.globalRoles,
          account: user.account,
        });
      }
    });
  }

  static async csrf() {
    const token = (await cookies()).get("csrf_token")?.value;
    return NextResponse.json({ token });
  }

  static async signout(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const token = (await this.getUser()) ?? "";
        const refresh_token = (await this.getRefreshToken()) ?? "";
        if (!token) {
          reject("Unauthorized");
        }
        if (!refresh_token) {
          (await cookies()).delete(`${process.env.APP_NAME}.session`);
          (await cookies()).delete(`${process.env.APP_NAME}.refresh_token`);
          resolve("Signout success");
        }
        const response = await fetch(
          `${AUTH_BASE_URI_INTERNAL ?? AUTH_BASE_URI}/auth/signout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              refresh_token: refresh_token,
            }),
            cache: "no-store",
          }
        );
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }
        (await cookies()).delete(`${process.env.APP_NAME}.refresh_token`);
        (await cookies()).delete(`${process.env.APP_NAME}.session`);
        resolve("Signout success");
      } catch (error: any) {
        console.error("Error signing out:", error);
        reject("Signout failed");
      }
    });
  }
}

