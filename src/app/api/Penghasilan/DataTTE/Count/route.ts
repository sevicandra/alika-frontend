import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";
import { revalidateTag } from "next/cache";
const apiBaseUrl =
  process.env.API_ALIKA_BASE_URL_INTERNAL ?? process.env.API_ALIKA_BASE_URL;

export async function GET(request: Request) {
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
  const url = new URL(request.url);
  const tahun = url.searchParams.get("tahun") || undefined;
  const jenis = url.searchParams.get("jenis") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const hal = url.searchParams.get("hal") || undefined;

  const searchParams = new URLSearchParams();
  if (tahun) searchParams.append("tahun", tahun);
  if (jenis) searchParams.append("jenis", jenis);
  if (status) searchParams.append("status", status);
  if (hal) searchParams.append("hal", hal);
  try {
    const countDataCetak = await fetch(
       `${apiBaseUrl}/api/v2/DataTte/Count/?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        next: { revalidate: 60, tags: ["Penghasilan:DataCetak:TTE"] },
      },
    );
    if (!countDataCetak.ok) {
      revalidateTag("Penghasilan:DataCetak:TTE");
      const data = await countDataCetak.json();
      return NextResponse.json(
        { message: data.message },
        { status: countDataCetak.status },
      );
    }
    const data = await countDataCetak.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    revalidateTag("Penghasilan:DataCetak:TTE");
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
