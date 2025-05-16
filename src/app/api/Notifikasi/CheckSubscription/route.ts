import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const apiBaseUrl =
  process.env.WEB_PUSH_BASE_URI_INTERNAL ?? process.env.WEB_PUSH_BASE_URI;

export const POST = async (req: Request) => {
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
  const { endpoint } = await req.json();
  try {
    const checkSubscription = await fetch(apiBaseUrl + "/check-subscription", {
      method: "POST",
      body: JSON.stringify({
        endpoint: endpoint,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      cache: "no-store",
    });
    if (!checkSubscription.ok) {
      const data = await checkSubscription.json();
      return NextResponse.json(
        { message: data.message },
        { status: checkSubscription.status },
      );
    }
    const data = await checkSubscription.json();
    return NextResponse.json(
      { message: "success", data: data.data },
      { status: 200 },
    );
  } catch (error: any) {    
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
