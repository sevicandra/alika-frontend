import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const apiBaseUrl =
  process.env.MUTASI_ALIKA_BASE_URL_INTERNAL ??
  process.env.MUTASI_ALIKA_BASE_URL;

export async function GET(
  req: Request,
  params: {
    params: Promise<{
      mutasi_id: string;
      pembayaran_id: string;
      dokumen_id: string;
      path: string;
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
  const { mutasi_id, pembayaran_id, dokumen_id, path } = await params.params;
  console.log(mutasi_id, pembayaran_id, dokumen_id, path);

  try {
    if (path === "Status") {
      const res = await fetch(
        `${apiBaseUrl}/api/v2/Pegawai/Mutasi/${mutasi_id}/Pembayaran/${pembayaran_id}/Dokumen/${dokumen_id}/SPD2/${path}`,
        {
          method: "GET",
          headers: {
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
    } else {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  params: {
    params: Promise<{
      mutasi_id: string;
      pembayaran_id: string;
      dokumen_id: string;
      path: string;
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
  const { mutasi_id, pembayaran_id, dokumen_id, path } = await params.params;
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v2/Pegawai/Mutasi/${mutasi_id}/Pembayaran/${pembayaran_id}/Dokumen/${dokumen_id}/SPD2/${path}`,
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

export async function DELETE(
  req: Request,
  params: {
    params: Promise<{
      mutasi_id: string;
      pembayaran_id: string;
      dokumen_id: string;
      path: string;
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
  const { mutasi_id, pembayaran_id, dokumen_id, path } = await params.params;
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v2/Pegawai/Mutasi/${mutasi_id}/Pembayaran/${pembayaran_id}/Dokumen/${dokumen_id}/SPD2/${path}`,
      {
        method: "DELETE",
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
