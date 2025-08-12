import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";
import { revalidateTag } from "next/cache";
const apiBaseUrl =
  process.env.API_ALIKA_BASE_URL_INTERNAL ?? process.env.API_ALIKA_BASE_URL;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
  const { id } = await params;
  try {
    const getDataCetak = await fetch(`${apiBaseUrl}/api/v2/DataTte/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      next: { revalidate: 60, tags: [`Penghasilan:DataCetak`] },
    });
    if (!getDataCetak.ok) {
      revalidateTag(`Penghasilan:DataCetak`);
      const data = await getDataCetak.json();
      return NextResponse.json(data, { status: getDataCetak.status });
    }
    const data = await getDataCetak.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    revalidateTag(`Penghasilan:DataCetak`);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
