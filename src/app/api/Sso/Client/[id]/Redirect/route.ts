import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const apiBaseUrl = process.env.AUTH_BASE_URI_INTERNAL ?? process.env.AUTH_BASE_URI;

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = (await cookies()).get(`${process.env.APP_NAME}.session`)?.value;
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }
  const user = await verify(session);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }
  const { id } = await params;
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);

  try {
    const res = await fetch(
      `${apiBaseUrl}/api/v2/Account/Client/${id}/Redirect?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
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

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = (await cookies()).get(`${process.env.APP_NAME}.session`)?.value;
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }
  const user = await verify(session);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 500 });
  }
  const { id } = await params;
  try {
    const ref = await fetch(`${apiBaseUrl}/api/v2/Account/Client/${id}/Redirect`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await req.json()),
      cache: "no-store",
    });
    if (!ref.ok) {
      const data = await ref.json();
      return NextResponse.json(data, { status: ref.status });
    }
    const data = await ref.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
