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
  const limit = url.searchParams.get("limit") || undefined;
  const offset = url.searchParams.get("offset") || undefined;
  const bulan = url.searchParams.get("bulan") || undefined;
  const kdjns = url.searchParams.get("kdjns") || undefined;
  const sortField = url.searchParams.get("sortField") || "bulan";
  const sortOrder = url.searchParams.get("sortOrder") || "asc";
  const searchParams = new URLSearchParams();
  if (tahun) searchParams.append("tahun", tahun);
  if (limit) searchParams.append("limit", limit);
  if (offset) searchParams.append("offset", offset);
  if (bulan) searchParams.append("bulan", bulan);
  if (kdjns) searchParams.append("kdjns", kdjns);
  if (sortField) searchParams.append("sortField", sortField);
  if (sortOrder) searchParams.append("sortOrder", sortOrder);

  try {
    const gaji = await fetch(
      `${apiBaseUrl}/api/v2/Gaji/?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        next: { revalidate: 60, tags: [`Penghasilan:Gaji`] },
      },
    );
    if (!gaji.ok) {
      revalidateTag(`Penghasilan:Gaji`);
      const data = await gaji.json();
      return NextResponse.json(data, { status: gaji.status });
    }
    const data = await gaji.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    revalidateTag(`Penghasilan:Gaji`);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
