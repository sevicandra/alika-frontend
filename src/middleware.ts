import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { verify, encrypt, decrypt } from "@/lib/jwt";
import { nanoid } from "nanoid";
import { cookies as getCookies } from "next/headers";
import OAuthOptions from "@/lib/OAuthOptions";
import { Mutex } from "async-mutex";
const csrfProtectedMethods = ["POST", "PUT", "PATCH", "DELETE"];
const userLocks = new Map<string, Mutex>();
async function getUserMutex(userId: string) {
  if (!userLocks.has(userId)) {
    userLocks.set(userId, new Mutex());
  }
  return userLocks.get(userId)!;
}
export default async function middleware(req: NextRequest) {
  const cookies = getCookies();
  const { pathname } = req.nextUrl;
  if (pathname === "/penghasilan") {
    return NextResponse.redirect(new URL("/penghasilan/dashboard", req.url));
  }
  try {
    let csrfTokenCookie = (await cookies).get("csrf_token")?.value;
    if (!csrfTokenCookie) {
      const newCsrfToken = nanoid();
      const encryptedCsrfToken = await encrypt({ newCsrfToken });
      (await cookies).set("csrf_token", encryptedCsrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60, // 1h
      });
      csrfTokenCookie = newCsrfToken;
    }
  } catch (error) {
    console.error("Failed to set CSRF token:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
  if (
    pathname.startsWith("/api/auth") &&
    !pathname.startsWith("/api/auth/session")
  ) {    
    return NextResponse.next();
  }
  const sessionToken =
    (await cookies).get(`${process.env.APP_NAME}.session`)?.value || "";
  let user;
  
  if (sessionToken) {
    try {
      user = await verify(sessionToken);
    } catch (error) {
      (await cookies).delete(`${process.env.APP_NAME}.session`);
      user = null;
    }
  }
  if (!user) {
    const refresh_token = (await cookies).get(
      `${process.env.APP_NAME}.refresh_token`,
    )?.value;
    if (refresh_token) {
      const mutex = await getUserMutex(refresh_token);
      const release = await mutex.acquire();
      try {
        const currentToken =
          (await cookies).get(`${process.env.APP_NAME}.session`)?.value || "";
        const currentUser = await verify(currentToken).catch(() => null);
        if (currentUser) {
          user = currentUser;
        } else {
          await OAuthOptions.refreshToken({ refresh_token });
          const newToken =
            (await cookies).get(`${process.env.APP_NAME}.session`)?.value || "";
          await verify(newToken);
        }
        return NextResponse.redirect(new URL(pathname, req.url));
      } catch (error) {
        console.error("Error refreshing token:", error);
        (await cookies).delete(`${process.env.APP_NAME}.session`);
        (await cookies).delete(`${process.env.APP_NAME}.refresh_token`);
        return NextResponse.redirect(
          new URL(`${process.env.APP_URL}/api/auth/signin`, req.url),
        );
      } finally {
        release();
      }
    } else {
      (await cookies).delete(`${process.env.APP_NAME}.refresh_token`);
      return NextResponse.redirect(
        new URL(`${process.env.APP_URL}/api/auth/signin`),
      );
    }
  }
  if (
    pathname.startsWith("/api/Penghasilan") ||
    pathname.startsWith("/api/auth/session")
  ) {
    const { method } = req;
    if (csrfProtectedMethods.includes(method)) {
      try {
        const csrfTokenCookie = (await cookies).get("csrf_token")?.value;
        const csrfTokenHeader = req.headers.get("x-csrf-token");
        if (!csrfTokenHeader) {
          return NextResponse.json(
            { message: "Missing CSRF token" },
            { status: 403 },
          );
        }
        const decrypted = await decrypt(csrfTokenHeader);
        if (!decrypted || csrfTokenHeader !== csrfTokenCookie) {
          return NextResponse.json(
            { message: "Invalid CSRF token" },
            { status: 403 },
          );
        }
      } catch (error) {
        console.error("CSRF validation failed:", error);
        return NextResponse.json(
          { message: "CSRF validation error" },
          { status: 500 },
        );
      }
      const referer = req.headers.get("Referer") || "";
      const allowedOrigin = process.env.APP_URL || "";
      if (!referer.startsWith(allowedOrigin)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|manifest.webmanifest).*)",
  ],
};
