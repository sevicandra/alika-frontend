import { NextResponse } from "next/server";
import packageInfo from "../../../../package.json";

export async function GET() {
  return NextResponse.json(
    {
      status: "UP",
      timestamp: new Date().toISOString(),
      version: packageInfo.version,
    },
    { status: 200 },
  );
}
