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
  const tahun = parseInt(url.searchParams.get("tahun") as string) || undefined;
  const jenis = url.searchParams.get("jenis") || undefined;
  const searchParams = new URLSearchParams();
  if (tahun) searchParams.append("tahun", tahun.toString());
  if (jenis) searchParams.append("jenis", jenis);

  try {
    const kekuranganGaji = await fetch(
      `${apiBaseUrl}/api/v2/KekuranganGaji/GetRekap/?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        next: { revalidate: 60, tags: [`Penghasilan:KekuranganGaji:Rekap`] },
      },
    );

    if (!kekuranganGaji.ok) {
      revalidateTag(`Penghasilan:KekuranganGaji:Rekap`, "max");
      const data = await kekuranganGaji.json();
      return NextResponse.json(data, { status: kekuranganGaji.status });
    }
    const data = await kekuranganGaji.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    revalidateTag(`Penghasilan:KekuranganGaji:Rekap`, "max");
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}
