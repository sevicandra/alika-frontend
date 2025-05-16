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
    const kp4 = await fetch(`${apiBaseUrl}/api/v2/Skp/Preview/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      body: JSON.stringify({
        bulan: bulan.toString().length === 1 ? `0${bulan}` : bulan,
        tahun: tahun,
      }),
      next: { revalidate: 60, tags: [`Penghasilan:Skp`] },
    });
    if (!kp4.ok) {
      revalidateTag(`Penghasilan:KP4`);
      const data = await kp4.json();
      return NextResponse.json(
        { message: data.message },
        { status: kp4.status },
      );
    }
    const data = await kp4.blob();
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error: any) {
    revalidateTag(`Penghasilan:KP4`);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export { handler as POST };
