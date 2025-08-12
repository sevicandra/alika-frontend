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
  const url = new URL(req.url);
  const tahun = url.searchParams.get("tahun") || undefined;
  const searchParams = new URLSearchParams();
  if (tahun) searchParams.append("tahun", tahun);
  try {
    const penghasilan = await fetch(
      `${apiBaseUrl}/api/v2/Penghasilan/Detail/?${searchParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        next: { revalidate: 60, tags: [`Penghasilan:Penghasilan:Detail`] },
      },
    );

    if (!penghasilan.ok) {
      revalidateTag(`Penghasilan:Penghasilan:Detail`);
      const data = await penghasilan.json();
      return NextResponse.json(data, { status: penghasilan.status });
    }
    const data = await penghasilan.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    revalidateTag(`Penghasilan:Penghasilan:Detail`);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export { handler as GET };
