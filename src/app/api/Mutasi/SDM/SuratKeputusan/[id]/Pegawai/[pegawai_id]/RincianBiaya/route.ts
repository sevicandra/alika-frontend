import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const apiBaseUrl =
  process.env.MUTASI_ALIKA_BASE_URL_INTERNAL ??
  process.env.MUTASI_ALIKA_BASE_URL;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; pegawai_id: string }> },
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
  const { id, pegawai_id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }

  const searchParams = new URL(req.url).searchParams;
  const offset = searchParams.get("offset");
  const limit = searchParams.get("limit");
  const search = searchParams.get("search");
  const sortField = searchParams.get("sortField");
  const sortOrder = searchParams.get("sortOrder");
  const associations = searchParams.get("associations");

  const searchParamsString = new URLSearchParams();
  if (offset) searchParamsString.append("offset", offset);
  if (limit) searchParamsString.append("limit", limit);
  if (search) searchParamsString.append("search", search);
  if (sortField) searchParamsString.append("sortField", sortField);
  if (sortOrder) searchParamsString.append("sortOrder", sortOrder);
  if (associations) searchParamsString.append("associations", associations);

  try {
    const suratKeputusan = await fetch(
      `${apiBaseUrl}/api/v2/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/RincianBiaya?${searchParamsString.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        cache: "no-store",
      },
    );

    if (!suratKeputusan.ok) {
      const data = await suratKeputusan.json();
      return NextResponse.json(data, { status: suratKeputusan.status });
    }
    const data = await suratKeputusan.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; pegawai_id: string }> },
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
  const { id, pegawai_id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }
  try {
    const suratKeputusan = await fetch(
      `${apiBaseUrl}/api/v2/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/RincianBiaya`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify(await req.json()),
        cache: "no-store",
      },
    );
    if (!suratKeputusan.ok) {
      const data = await suratKeputusan.json();
      return NextResponse.json(data, { status: suratKeputusan.status });
    }
    const data = await suratKeputusan.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
