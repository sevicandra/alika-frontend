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
  const { tahun } = await req.json();
  try {
    const dataCetak = await fetch(`${apiBaseUrl}/api/v2/1721-VII/Preview/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      body: JSON.stringify({
        tahun: tahun,
      }),
      next: { revalidate: 60, tags: [`Penghasilan:1721-VII:${tahun}`] },
    });
    if (!dataCetak.ok) {
      revalidateTag(`Penghasilan:1721-VII:${tahun}`);
      const data = await dataCetak.json();
      return NextResponse.json(
        { message: data.message },
        { status: dataCetak.status },
      );
    }
    const data = await dataCetak.blob();
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error: any) {
    revalidateTag(`Penghasilan:1721-VII:${tahun}`);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export { handler as POST };
