import 'server-only'
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
    const gaji = await fetch(
      `${apiBaseUrl}/api/v2/Gaji/GetRekap/?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        next: { revalidate: 60, tags: [`Penghasilan:Gaji:Rekap`] },
      },
    );

    if (!gaji.ok) {
      revalidateTag(`Penghasilan:Gaji:Rekap`);
      const data = await gaji.json();
      return NextResponse.json(
        { message: data.message },
        { status: gaji.status },
      );
    }
    const data = await gaji.json();    
    return NextResponse.json(data, { status: 200 });
  } catch (error:any) {
    revalidateTag(`Penghasilan:Gaji:Rekap`);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
