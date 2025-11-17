import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";
import { revalidateTag } from "next/cache";
const apiBaseUrl =
  process.env.API_ALIKA_BASE_URL_INTERNAL ?? process.env.API_ALIKA_BASE_URL;

export async function POST(req: Request) {
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
  const { passphrase, id } = await req.json();
  try {
    const tukin = await fetch(`${apiBaseUrl}/api/v2/Tte`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      body: JSON.stringify({
        id: id,
        Passphrase: passphrase,
      }),
      cache: "no-store",
    });

    if (!tukin.ok) {
      const data = await tukin.json();
      return NextResponse.json(data, { status: tukin.status });

    }
    const data = await tukin.json();
    revalidateTag("Penghasilan:DataCetak:TTE", "max");
    revalidateTag("Penghasilan:DataCetak:RiwayatTTE", "max");
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
