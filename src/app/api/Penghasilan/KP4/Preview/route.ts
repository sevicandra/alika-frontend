import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";
import { revalidateTag } from "next/cache";
const apiBaseUrl =
  process.env.API_ALIKA_BASE_URL_INTERNAL ?? process.env.API_ALIKA_BASE_URL;

async function handler() {
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
  try {
    const kp4 = await fetch(`${apiBaseUrl}/api/v2/KP4/Preview/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      next: { revalidate: 60, tags: [`Penghasilan:KP4`] },
    });
    if (!kp4.ok) {
      revalidateTag(`Penghasilan:KP4`, "max");
      const data = await kp4.json();
      return NextResponse.json(data, { status: kp4.status });
    }
    const data = await kp4.blob();
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    revalidateTag(`Penghasilan:KP4`, "max");
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}

export { handler as POST };
