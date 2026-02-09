import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const apiBaseUrl =
  process.env.MUTASI_ALIKA_BASE_URL_INTERNAL ??
  process.env.MUTASI_ALIKA_BASE_URL;

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
  const jenjang = url.searchParams.get("jenjang") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const search = url.searchParams.get("search") || undefined;

  const searchParams = new URLSearchParams();
  if (jenjang) searchParams.append("jenjang", jenjang);
  if (status) searchParams.append("status", status);
  if (search) searchParams.append("search", search);

  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v2/SDM/SuratKeputusan/Count?${searchParams.toString()}`,
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
