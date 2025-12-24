import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "./jwt";
import { Mutex } from "async-mutex";
import { SessionData } from "@/types/auth";

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
        const { error } = await res.json();
        throw new Error(error);
      }
      const { access_token, refresh_token, expires_in } = await res.json();
      (await cookies()).set(`${process.env.APP_NAME}.session`, access_token, {
        httpOnly: true,
        secure: process.env.APP_COOKIES === "secure" ? true : false,
        path: "/",
        sameSite: "lax",
        maxAge: expires_in,
      });
      (await cookies()).set(
        `${process.env.APP_NAME ?? "FRONTEND"}.refresh_token`,
        refresh_token,
        {
          httpOnly: true,
          secure: process.env.APP_COOKIES === "secure" ? true : false,
          path: "/",
          sameSite: "lax",
          maxAge: 60 * 60,
        }
      );
      return NextResponse.redirect(new URL(`${process.env.APP_URL}`, req.url));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return NextResponse.json(
          { status: "failed", message: error.message },
          { status: 500 }
        );
      } else {
        return NextResponse.json(
          { status: "failed", message: "Internal Server Error" },
          { status: 500 }
        );
      }
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
              secure: process.env.APP_COOKIES === "secure" ? true : false,
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
              secure: process.env.APP_COOKIES === "secure" ? true : false,
              path: "/",
              sameSite: "lax",
              maxAge: 60 * 60,
            }
          );
          resolve();
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          reject(error.message);
        } else {
          reject("Error refreshing token");
        }
      }
    });
  }

  static async session(): Promise<SessionData> {
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
              // Coba ambil token baru setelah refresh
              const retryToken = (await this.getUser()) ?? "";
              const retryUser = await verify(retryToken).catch(() => null);
              if (retryUser) {
                resolve({
                  user: {
                    sub: retryUser.sub as string,
                    name: retryUser.name as string,
                    nik: retryUser.nik as string,
                    nip: retryUser.nip as string,
                    kode_satker: retryUser.kode_satker as string,
                    satker: retryUser.satker as string,
                    gravatar: retryUser.gravatar as string,
                  },
                  account: retryUser.account as {
                    service: string;
                    kode_satker: string | null;
                    roles: {
                      kode: string;
                      nama: string;
                    }[];
                  }[],
                }); // Return user yang baru di-refresh
                return;
              }
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
            sub: user.sub as string,
            name: user.name as string,
            nik: user.nik as string,
            nip: user.nip as string,
            kode_satker: user.kode_satker as string,
            satker: user.satker as string,
            gravatar: user.gravatar as string,
          },
          account: user.account as {
            service: string;
            kode_satker: string | null;
            roles: {
              kode: string;
              nama: string;
            }[];
          }[],
        });
      }
    });
  }

  static async csrf() {
    const token = (await cookies()).get("csrf_token")?.value;
    return NextResponse.json({ token });
  }

  static async signout(): Promise<{
    redirect?: string;
    message: string;
  }> {
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
          resolve({ message: "Signout success" });
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
        resolve({
          redirect: (await response.json()).data.redirect as string,
          message: "Signout success",
        });
      } catch (error: unknown) {
        console.error("Error signing out:", error);
        reject("Signout failed");
      }
    });
  }
}
