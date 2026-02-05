import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const apiBaseUrl =
  process.env.MUTASI_ALIKA_BASE_URL_INTERNAL ??
  process.env.MUTASI_ALIKA_BASE_URL;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = (await cookies()).get(
    `${process.env.APP_NAME}.session`,
  )?.value;
  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        origin: "local",
        error: {
          message: "session not found",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 401 },
    );
  }
  const user = await verify(session);
  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        origin: "local",
        error: {
          message: "session not valid",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 401 },
    );
  }
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v2/SDM/SuratKeputusan/${id}`,
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
            return NextResponse.json(
        { ...data, origin: "upstream" },
        { status: res.status },
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        origin: "local",
        error: {
          message: (error as Error).message,
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = (await cookies()).get(
    `${process.env.APP_NAME}.session`,
  )?.value;
  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        origin: "local",
        error: {
          message: "session not found",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 401 },
    );
  }
  const user = await verify(session);
  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        origin: "local",
        error: {
          message: "session not valid",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 401 },
    );
  }
  const { id } = await params;
  const formData = await req.formData();

  const file = formData.get("file") as File;
  const nomor = formData.get("nomor") as string;
  const uraian = formData.get("uraian") as string;
  const tanggal = formData.get("tanggal") as string;
  const tmt = formData.get("tmt") as string;
  const jenjang = formData.get("jenjang") as string;

  const backendForm = new FormData();
  if (file) backendForm.set("file", file, file.name);
  if (nomor) backendForm.set("nomor", nomor);
  if (uraian) backendForm.set("uraian", uraian);
  if (tanggal) backendForm.set("tanggal", tanggal);
  if (tmt) backendForm.set("tmt", tmt);
  if (jenjang) backendForm.set("jenjang", jenjang);
  try {
    const suratKeputusan = await fetch(
      `${apiBaseUrl}/api/v2/SDM/SuratKeputusan/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session}`,
        },
        body: backendForm,
        cache: "no-store",
      },
    );
    if (!suratKeputusan.ok) {
      const data = await suratKeputusan.json();
      return NextResponse.json(data, { status: suratKeputusan.status });
    }
    const data = await suratKeputusan.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        origin: "upstream",
        error: {
          message: (error as Error).message,
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = (await cookies()).get(
    `${process.env.APP_NAME}.session`,
  )?.value;
  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        origin: "local",
        error: {
          message: "session not found",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 401 },
    );
  }
  const user = await verify(session);
  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        origin: "local",
        error: {
          message: "session not valid",
          statusCode: 401,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 401 },
    );
  }
  const { id } = await params;

  try {
    const suratKeputusan = await fetch(
      `${apiBaseUrl}/api/v2/SDM/SuratKeputusan/${id}`,
      {
        method: "DELETE",
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
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        origin: "upstream",
        error: {
          message: (error as Error).message,
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    );
  }
}
