import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";
import { revalidateTag } from "next/cache";
const apiBaseUrl =
  process.env.API_ALIKA_BASE_URL_INTERNAL ?? process.env.API_ALIKA_BASE_URL;

export async function GET(req: Request) {
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
  const url = new URL(req.url);
  const tahun = url.searchParams.get("tahun") || undefined;
  const bulan = url.searchParams.get("bulan") || undefined;
  const searchParams = new URLSearchParams();
  if (tahun) searchParams.append("tahun", tahun);
  if (bulan) searchParams.append("bulan", bulan);

  try {
    const tukin = await fetch(
      `${apiBaseUrl}/api/v2/KekuranganTukin/GetRekap/?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        next: { revalidate: 60, tags: [`Penghasilan:KekuranganTukin:Rekap`] },
      },
    );

    if (!tukin.ok) {
      revalidateTag(`Penghasilan:KekuranganTukin:Rekap`, "max");
      const data = await tukin.json();
      return NextResponse.json(data, { status: tukin.status });
    }
    const data = await tukin.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    revalidateTag(`Penghasilan:KekuranganTukin:Rekap`, "max");
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}
