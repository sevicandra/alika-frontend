import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const apiBaseUrl = process.env.MUTASI_ALIKA_BASE_URL_INTERNAL ?? process.env.MUTASI_ALIKA_BASE_URL;

export async function GET(
  req: Request,
  params: {
    params: Promise<{
      mutasi_id: string;
      sanggah_id: string;
    }>;
  }
) {
  const session = (await cookies()).get(`${process.env.APP_NAME}.session`)?.value;
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }
  const user = await verify(session);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }

  const { mutasi_id, sanggah_id } = await params.params;

  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v2/Pegawai/Mutasi/${mutasi_id}/Sanggah/${sanggah_id}/Data`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify(await req.json()),
        cache: "no-store",
      }
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
