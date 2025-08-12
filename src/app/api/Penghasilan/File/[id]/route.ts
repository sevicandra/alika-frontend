import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";
import { revalidateTag } from "next/cache";
const apiBaseUrl =
  process.env.API_ALIKA_BASE_URL_INTERNAL ?? process.env.API_ALIKA_BASE_URL;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
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

  if (!id) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }
  try {
    const getFile = await fetch(`${apiBaseUrl}/api/v2/FilePreview/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      next: { revalidate: 60, tags: [`Penghasilan:File:${id}`] },
    });
    if (!getFile.ok) {
      revalidateTag(`Penghasilan:File:${id}`);
      const data = await getFile.json();
      return NextResponse.json(data, { status: getFile.status });
    }
    const data = await getFile.blob();
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error: any) {
    revalidateTag(`Penghasilan:File:${id}`);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
