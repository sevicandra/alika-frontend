import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const apiBaseUrl =
  process.env.AUTH_BASE_URI_INTERNAL ?? process.env.AUTH_BASE_URI;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ kode: string }> },
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
  const { kode } = await params;
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);

  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v2/Account/Referensi/Service/${kode}/Scope?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
