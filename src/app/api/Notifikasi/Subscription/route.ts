import "server-only";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const apiBaseUrl =
  process.env.WEB_PUSH_BASE_URI_INTERNAL ?? process.env.WEB_PUSH_BASE_URI;

export const POST = async (req: NextRequest) => {
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
  const {
    endpoint,
    keys: { p256dh, auth },
  } = await req.json();
  console.log(endpoint, p256dh, auth);

  try {
    const subscribe = await fetch(apiBaseUrl + "/subscription", {
      method: "POST",
      body: JSON.stringify({
        endpoint: endpoint,
        p256dh: p256dh,
        auth: auth,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
      cache: "no-store",
    });

    if (!subscribe.ok) {
      const data = await subscribe.json();
      return NextResponse.json(
        { message: data.message },
        { status: subscribe.status }
      );
    }

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
export const PATCH = async (req: NextRequest) => {
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
  try {
    const { endpoint } = await req.json();
    
    const subscription = await fetch(
      apiBaseUrl + "/subscription/endpoint",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify({
          endpoint: endpoint,
        }),
        cache: "no-store",
      }
    );

    if (!subscription.ok) {
      const data = await subscription.json();
      return NextResponse.json(
        data,
        { status: subscription.status }
      );
    }
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
export const DELETE = async (req: NextRequest) => {
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
  try {
    const { endpoint } = await req.json();
    const subscription = await fetch(
      apiBaseUrl + "/subscription/endpoint",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify({
          endpoint: endpoint,
        }),
        cache: "no-store",
      }
    );

    if (!subscription.ok) {
      const data = await subscription.json();
      return NextResponse.json(
        data,
        { status: subscription.status }
      );
    }
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};