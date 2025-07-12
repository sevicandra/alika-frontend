import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";
import { revalidateTag } from "next/cache";

const apiBaseUrl =
  process.env.MUTASI_ALIKA_BASE_URL_INTERNAL ??
  process.env.MUTASI_ALIKA_BASE_URL;

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
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
  const { id } = await params;

  try {
    const res = await fetch(`${apiBaseUrl}/api/v2/Pegawai/TTE/${id}/File`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      next: { revalidate: 60, tags: ["Mutasi:TTE:File"] },
    });

    if (!res.ok) {
      revalidateTag("Mutasi:TTE:File");
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
    const contentDisposition = res.headers.get("Content-Disposition");
    let filename = "dokumen.pdf"; // Nama file default jika header tidak ditemukan
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }
    const data = await res.blob();
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    revalidateTag("Mutasi:Sanggah:File");
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      mutasi_id: string;
      pembayaran_id: string;
      dokumen_id: string;
    }>;
  },
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
  const { mutasi_id, pembayaran_id, dokumen_id } = await params;
  const formData = await req.formData();

  const file = formData.get("file") as File;

  const backendForm = new FormData();
  backendForm.set("file", file, file.name);
  try {
    const suratKeputusan = await fetch(
      `${apiBaseUrl}/api/v2/Pegawai/Mutasi/${mutasi_id}/Pembayaran/${pembayaran_id}/Dokumen/${dokumen_id}/File`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session}`,
        },
        body: backendForm as any,
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

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      mutasi_id: string;
      pembayaran_id: string;
      dokumen_id: string;
    }>;
  },
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
  const { mutasi_id, pembayaran_id, dokumen_id } = await params;

  try {
    const suratKeputusan = await fetch(
      `${apiBaseUrl}/api/v2/Pegawai/Mutasi/${mutasi_id}/Pembayaran/${pembayaran_id}/Dokumen/${dokumen_id}/File`,
      {
        method: "DELETE",
        headers: {
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
