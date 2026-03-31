import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { encrypt, decrypt } from "@/lib/jwt";
import { nanoid } from "nanoid";
import { cookies as getCookies } from "next/headers";
import { OAuth2 } from "@/lib/OAuthOptions";
import { UserSession } from "@/types/auth";
import { checkRouteAccess } from "@/lib/routes";
const csrfProtectedMethods = ["POST", "PUT", "PATCH", "DELETE"];

export default async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Content-Security-Policy", "frame-ancestors 'self'");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  const cookies = getCookies();
  const { pathname } = req.nextUrl;
  let user: UserSession;
  if (
    pathname.startsWith("/api/auth/signin") &&
    pathname.startsWith("/api/auth/callback")
  ) {
    return response;
  }
  try {
    const csrfTokenCookie = (await cookies).get("csrf_token")?.value;
    if (!csrfTokenCookie) {
      const newCsrfToken = nanoid();
      const encryptedCsrfToken = await encrypt({ newCsrfToken });
      (await cookies).set("csrf_token", encryptedCsrfToken, {
        httpOnly: true,
        secure: process.env.APP_COOKIES === "secure",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60, // 1h
      });
      return NextResponse.redirect(req.url);
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
        error: {
          message: (error as Error).message,
          code: 500,
        },
      },
      { status: 500 },
    );
  }
  if (
    pathname.startsWith("/api/auth") &&
    !pathname.startsWith("/api/auth/session") &&
    !pathname.startsWith("/api/auth/signout")
  ) {
    return response;
  }
  try {
    user = await OAuth2.session();
  } catch (error) {
    if (error === "Token expired") {
      return NextResponse.redirect(new URL(req.url));
    }

    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        {
          status: "failed",
          message: "Unauthorized",
          error: {
            message: "Unauthorized",
            code: 401,
          },
        },
        { status: 401 },
      );
    }
    return NextResponse.redirect(
      new URL(`${process.env.APP_URL}/api/auth/signin`, req.url),
    );
  }
  const routeCheck = checkRouteAccess(pathname, user.account);
  if (!routeCheck.authorized) {
    return NextResponse.redirect(new URL(routeCheck.redirect || "/", req.url));
  }
  if (routeCheck.redirect) {
    return NextResponse.redirect(new URL(routeCheck.redirect, req.url));
  }
  if (pathname.startsWith("/api")) {
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
        return NextResponse.json(
          {
            message: "CSRF validation error",
            error: {
              message: (error as Error).message,
              code: 500,
            },
          },
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
  return response;
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|manifest.webmanifest).*)",
  ],
};
