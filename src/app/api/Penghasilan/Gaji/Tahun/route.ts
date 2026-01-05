import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";
import { revalidateTag } from "next/cache";
const apiBaseUrl = process.env.API_ALIKA_BASE_URL_INTERNAL ?? process.env.API_ALIKA_BASE_URL;

export async function GET() {
  const session = (await cookies()).get(`${process.env.APP_NAME}.session`)?.value;
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }
  const user = await verify(session);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }
  try {
    const dataCetak = await fetch(`${apiBaseUrl}/api/v2/Gaji/GetTahun/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      next: { revalidate: 60, tags: ["Penghasilan:Gaji:Tahun"] },
    });

    if (!dataCetak.ok) {
      revalidateTag("Penghasilan:Gaji:Tahun", "max");
      const data = await dataCetak.json();
      return NextResponse.json(data, { status: dataCetak.status });
    }
    const data = await dataCetak.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    revalidateTag("Penghasilan:Gaji:Tahun", "max");
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
