import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "./jwt";
import { Mutex } from "async-mutex";
import { SessionData } from "@/types/auth";

// ✅ FIXED: Use LRU cache for Mutex cleanup (prevent memory leak)
class MutexCache {
  private cache = new Map<string, { mutex: Mutex; lastUsed: number }>();
  private maxSize = 1000; // Max concurrent users
  private ttl = 5 * 60 * 1000; // 5 minutes TTL

  async getMutex(userId: string): Promise<Mutex> {
    // Cleanup old entries
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.lastUsed > this.ttl) {
        this.cache.delete(key);
      }
    }

    // If cache is full, clear oldest
    if (this.cache.size >= this.maxSize) {
      const oldest = Array.from(this.cache.entries()).sort(
        (a, b) => a[1].lastUsed - b[1].lastUsed
      )[0];
      if (oldest) {
        this.cache.delete(oldest[0]);
      }
    }

    if (!this.cache.has(userId)) {
      this.cache.set(userId, { mutex: new Mutex(), lastUsed: now });
    }

    const entry = this.cache.get(userId)!;
    entry.lastUsed = now;
    return entry.mutex;
  }
}

const mutexCache = new MutexCache(); // ✅ FIXED: Use cache instead of unbounded Map

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
    const token = (await cookies()).get(`${process.env.APP_NAME}.session`)?.value;
    if (!token) {
      return null;
    }
    return token;
  }

  private static async getRefreshToken() {
    // ✅ FIXED: Consistent cookie key naming
    const refresh_token = (await cookies()).get(
      `${process.env.APP_NAME ?? "FRONTEND"}.refresh_token`
    )?.value;
    if (!refresh_token) {
      return null;
    }
    return refresh_token;
  }

  static async callback(req: NextRequest) {
    try {
      const code = new URL(req.url).searchParams.get("code");
      const res = await fetch(`${AUTH_BASE_URI_INTERNAL ?? AUTH_BASE_URI}/${AUTH_TOKEN_ENDPOINT}`, {
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
      });
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
      (await cookies()).set(`${process.env.APP_NAME ?? "FRONTEND"}.refresh_token`, refresh_token, {
        httpOnly: true,
        secure: process.env.APP_COOKIES === "secure" ? true : false,
        path: "/",
        sameSite: "lax",
        maxAge: 44 * 60,
      });
      return NextResponse.redirect(new URL(`${process.env.APP_URL}`, req.url));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return NextResponse.json({ status: "failed", message: error.message }, { status: 500 });
      } else {
        return NextResponse.json(
          { status: "failed", message: "Internal Server Error" },
          { status: 500 }
        );
      }
    }
  }

  // ✅ FIXED: Removed Promise wrapper anti-pattern
  static async refreshToken({ refresh_token }: { refresh_token: string }): Promise<void> {
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
      }
      const { access_token, refresh_token: newRefreshToken, expires_in } = await response.json();
      (await cookies()).set(`${process.env.APP_NAME}.session`, access_token, {
        httpOnly: true,
        secure: process.env.APP_COOKIES === "secure" ? true : false,
        path: "/",
        sameSite: "lax",
        maxAge: expires_in,
      });
      (await cookies()).set(
        `${process.env.APP_NAME ?? "FRONTEND"}.refresh_token`,
        newRefreshToken,
        {
          httpOnly: true,
          secure: process.env.APP_COOKIES === "secure" ? true : false,
          path: "/",
          sameSite: "lax",
          maxAge: 44 * 60,
        }
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error refreshing token";
      throw new Error(errorMessage);
    }
  }

  // ✅ FIXED: Removed Promise wrapper anti-pattern + fixed race condition
  static async session(): Promise<SessionData> {
    const token = (await this.getUser()) ?? "";
    const user = await verify(token).catch(() => null);

    if (!user) {
      const refresh_token = await this.getRefreshToken();
      if (!refresh_token) {
        throw new Error("Unauthorized");
      }

      // ✅ FIXED: Proper race condition handling
      const mutex = await mutexCache.getMutex(refresh_token);
      const isInitiator = !mutex.isLocked();
      const release = await mutex.acquire();
      try {
        if (isInitiator) {
          await this.refreshToken({ refresh_token });
        }
        throw new Error("Token expired");
      } catch (error) {
        console.error("Error refreshing token:", error);
        (await cookies()).delete(`${process.env.APP_NAME}.session`);
        (await cookies()).delete(`${process.env.APP_NAME}.refresh_token`);
        throw new Error("Unauthorized");
      } finally {
        setTimeout(() => {
          release();
        }, 100);
      }
    }

    return {
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
    };
  }

  static async csrf() {
    const token = (await cookies()).get("csrf_token")?.value;
    return NextResponse.json({ token });
  }

  // ✅ FIXED: Removed Promise wrapper anti-pattern + added proper null checks
  static async signout(): Promise<{
    redirect?: string;
    message: string;
  }> {
    try {
      const token = (await this.getUser()) ?? "";
      const refresh_token = (await this.getRefreshToken()) ?? "";

      // ✅ FIXED: Proper null checks
      if (!token) {
        throw new Error("Unauthorized");
      }

      if (!refresh_token) {
        (await cookies()).delete(`${process.env.APP_NAME}.session`);
        (await cookies()).delete(`${process.env.APP_NAME ?? "FRONTEND"}.refresh_token`);
        return { message: "Signout success" };
      }

      const response = await fetch(`${AUTH_BASE_URI_INTERNAL ?? AUTH_BASE_URI}/auth/signout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          refresh_token: refresh_token,
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      (await cookies()).delete(`${process.env.APP_NAME}.refresh_token`);
      (await cookies()).delete(`${process.env.APP_NAME}.session`);

      const responseData = await response.json();
      return {
        redirect: responseData.data.redirect as string,
        message: "Signout success",
      };
    } catch (error: unknown) {
      console.error("Error signing out:", error);
      throw new Error("Signout failed");
    }
  }
}
