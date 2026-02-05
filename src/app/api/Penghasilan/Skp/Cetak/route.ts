import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";
import { revalidateTag } from "next/cache";
const apiBaseUrl =
  process.env.API_ALIKA_BASE_URL_INTERNAL ?? process.env.API_ALIKA_BASE_URL;

async function handler(req: Request) {
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
  const { tahun, bulan } = await req.json();
  try {
    const res = await fetch(`${apiBaseUrl}/api/v2/Skp/Cetak/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      body: JSON.stringify({
        bulan: bulan.toString().length === 1 ? `0${bulan}` : bulan,
        tahun: tahun,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json(
        { ...data, origin: "upstream" },
        { status: res.status },
      );
    }
    revalidateTag("Penghasilan:DataCetak", "max");
    revalidateTag("Penghasilan:DataCetak:TTE", "max");
    const data = await res.json();
    return NextResponse.json({ message: data.message }, { status: 200 });
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

export { handler as POST };
