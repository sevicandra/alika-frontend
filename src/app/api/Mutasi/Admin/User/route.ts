import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const apiBaseUrl =
  process.env.AUTH_BASE_URI_INTERNAL ?? process.env.AUTH_BASE_URI;

export async function GET(req: Request) {
  const session = (await cookies()).get(
    `${process.env.APP_NAME}.session`,
  )?.value;
  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        origin: "local",
        error: {
          message: "session not found",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 401 },
    );
  }
  const user = await verify(session);
  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        origin: "local",
        error: {
          message: "session not valid",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const limit = url.searchParams.get("limit")
    ? Number(url.searchParams.get("limit"))
    : undefined;
  const offset = url.searchParams.get("offset")
    ? Number(url.searchParams.get("offset"))
    : undefined;
  const search = url.searchParams.get("search") || undefined;

  const searchParams = new URLSearchParams();
  if (limit) searchParams.append("limit", limit.toString());
  if (offset) searchParams.append("offset", offset.toString());
  if (search) searchParams.append("search", search);

  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v2/Mutasi/User?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json(
        { ...data, origin: "upstream" },
        { status: res.status },
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        origin: "local",
        error: {
          message: (error as Error).message,
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = (await cookies()).get(
    `${process.env.APP_NAME}.session`,
  )?.value;
  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        origin: "local",
        error: {
          message: "session not found",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 401 },
    );
  }
  const user = await verify(session);
  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        origin: "local",
        error: {
          message: "session not valid",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 401 },
    );
  }
  try {
    const res = await fetch(`${apiBaseUrl}/api/v2/Mutasi/User`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await req.json()),
      cache: "no-store",
    });
    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json(
        { ...data, origin: "upstream" },
        { status: res.status },
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        origin: "local",
        error: {
          message: (error as Error).message,
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    );
  }
}
