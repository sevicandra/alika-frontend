import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const apiBaseUrl =
  process.env.MUTASI_ALIKA_BASE_URL_INTERNAL ??
  process.env.MUTASI_ALIKA_BASE_URL;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  if (!file) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }

  const backendForm = new FormData();
  backendForm.set("file", file, file.name);
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v2/Keuangan/SuratKeputusan/${id}/Payroll`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session}`,
        },
        body: backendForm as any,
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
