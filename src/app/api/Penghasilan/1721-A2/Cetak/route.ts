import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const apiBaseUrl =
  process.env.API_ALIKA_BASE_URL_INTERNAL ?? process.env.API_ALIKA_BASE_URL;

async function handler(req: Request) {
  const session = (await cookies()).get(
    `${process.env.APP_NAME}.session`,
  )?.value;
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }
  const user = await verify(session);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }
  const { tahun } = await req.json();
  try {
    const dataCetak = await fetch(`${apiBaseUrl}/api/v2/1721-A2/Cetak/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      body: JSON.stringify({
        tahun: tahun,
      }),
      cache: "no-store",
    });

    if (!dataCetak.ok) {
      const data = await dataCetak.json();
      return NextResponse.json(data, { status: dataCetak.status });
    }
    const data = await dataCetak.json();
    return NextResponse.json({ message: data.message }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export { handler as POST };
