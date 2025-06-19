import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";
import { revalidateTag } from "next/cache";

const apiBaseUrl =
  process.env.MUTASI_ALIKA_BASE_URL_INTERNAL ??
  process.env.MUTASI_ALIKA_BASE_URL;

export async function GET(req: Request) {
  const session = (await cookies()).get(
    `${process.env.APP_NAME}.session`
  )?.value;
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }
  const user = await verify(session);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }

  const url = new URL(req.url);
  const limit = url.searchParams.get("limit")
    ? Number(url.searchParams.get("limit"))
    : undefined;
  const offset = url.searchParams.get("offset")
    ? Number(url.searchParams.get("offset"))
    : undefined;
  const jenjang = url.searchParams.get("jenjang") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const search = url.searchParams.get("search") || undefined;

  const searchParams = new URLSearchParams();
  if (limit) searchParams.append("limit", limit.toString());
  if (offset) searchParams.append("offset", offset.toString());
  if (jenjang) searchParams.append("jenjang", jenjang);
  if (status) searchParams.append("status", status);
  if (search) searchParams.append("search", search);

  try {
    const suratKeputusan = await fetch(
      `${apiBaseUrl}/api/v2/SDM/SuratKeputusan?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        cache: "no-store",
      }
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

export async function POST(req: Request) {
  const session = (await cookies()).get(
    `${process.env.APP_NAME}.session`
  )?.value;
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }
  const user = await verify(session);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }

  const formData = await req.formData();

  const file = formData.get("file") as File;
  const nomor = formData.get("nomor") as string;
  const uraian = formData.get("uraian") as string;
  const tanggal = formData.get("tanggal") as string;
  const tmt = formData.get("tmt") as string;
  const jenjang = formData.get("jenjang") as string;

  const backendForm = new FormData();
  backendForm.set("file", file, file.name);
  backendForm.set("nomor", nomor);
  backendForm.set("uraian", uraian);
  backendForm.set("tanggal", tanggal);
  backendForm.set("tmt", tmt);
  backendForm.set("jenjang", jenjang);
  try {
    const suratKeputusan = await fetch(`${apiBaseUrl}/api/v2/SDM/SuratKeputusan`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session}`,
      },
      body: backendForm as any,
      cache: "no-store",
    });
    if (!suratKeputusan.ok) {
      const data = await suratKeputusan.json();
      return NextResponse.json(data, { status: suratKeputusan.status });
    }
    revalidateTag("Mutasi:SuratKeputusan");
    const data = await suratKeputusan.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
