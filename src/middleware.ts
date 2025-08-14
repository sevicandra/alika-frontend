import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { encrypt, decrypt } from "@/lib/jwt";
import { nanoid } from "nanoid";
import { cookies as getCookies } from "next/headers";
import { OAuth2 } from "@/lib/OAuthOptions";
const csrfProtectedMethods = ["POST", "PUT", "PATCH", "DELETE"];

export default async function middleware(req: NextRequest) {
  const cookies = getCookies();
  const { pathname } = req.nextUrl;
  let user: {
    user: {
      sub: string;
      name: string;
      nik: string;
      nip: string;
      kode_satker: string;
      satker: string;
      gravatar: string;
    };
    account: {
      service: string;
      kode_satker: string | null;
      roles: {
        kode: string;
        nama: string;
      }[];
    }[];
  };
    if (
    pathname.startsWith("/api/auth/signin")
  ) {
    return NextResponse.next();
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
  try {
    user = await OAuth2.session();
  } catch (error) {
    if (error === "Token expired") {
      return NextResponse.redirect(new URL(req.url));
    }
    console.error("Error getting session:", error);
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ message: "Session expired" }, { status: 401 });
    }
    return NextResponse.redirect(
      new URL(`${process.env.APP_URL}/api/auth/signin`, req.url),
    );
  }
  if (pathname === "/penghasilan") {
    return NextResponse.redirect(new URL("/penghasilan/dashboard", req.url));
  }
  if (pathname.startsWith("/mutasi")) {
    return NextResponse.redirect(new URL("https://mutasi-alika.kemenkeu.go.id", req.url));
    if (pathname === "/mutasi/admin") {
      if (
        !user.account
          .find((a) => a.service.toUpperCase() === "MUTASI")
          ?.roles.find((r) => r.nama.toUpperCase() === "ADMIN")
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.redirect(new URL("/mutasi/admin/user", req.url));
    }
    if (pathname === "/mutasi/user" || pathname === "/mutasi") {
      return NextResponse.redirect(new URL("/mutasi/user/dashboard", req.url));
    }
    if (pathname === "/mutasi/keuangan" || pathname === "/mutasi") {
      if (
        !user.account
          .find((a) => a.service.toUpperCase() === "MUTASI")
          ?.roles.find((r) => r.nama.toUpperCase() === "KEUANGAN")
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.redirect(
        new URL("/mutasi/keuangan/dashboard", req.url),
      );
    }
    if (pathname === "/mutasi/sdm") {
      if (
        !user.account
          .find((a) => a.service.toUpperCase() === "MUTASI")
          ?.roles.find((r) => r.nama.toUpperCase() === "SDM")
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.redirect(new URL("/mutasi/sdm/dashboard", req.url));
    }
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
