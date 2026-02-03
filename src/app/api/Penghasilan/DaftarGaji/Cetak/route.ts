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
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }
  const user = await verify(session);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }
  const { tahun, bulan } = await req.json();
  try {
    const dataCetak = await fetch(`${apiBaseUrl}/api/v2/DaftarGaji/Cetak/`, {
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
    if (!dataCetak.ok) {
      const data = await dataCetak.json();
      return NextResponse.json(data, { status: dataCetak.status });
    }
    revalidateTag("Penghasilan:DataCetak", "max");
    revalidateTag("Penghasilan:DataCetak:TTE", "max");
    const data = await dataCetak.json();
    return NextResponse.json({ message: data.message }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}

export { handler as POST };
