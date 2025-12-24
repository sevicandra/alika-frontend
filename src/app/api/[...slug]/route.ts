import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { pathname } = req.nextUrl;
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "ROUTE_NOT_FOUND",
        message: `Route GET ${pathname} not found`,
        statusCode: 404,
        timestamp: new Date().toISOString(),
      },
    },
    { status: 404 }
  );
}

export async function POST(req: NextRequest) {
  const { pathname } = req.nextUrl;
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "ROUTE_NOT_FOUND",
        message: `Route GET ${pathname} not found`,
        statusCode: 404,
        timestamp: new Date().toISOString(),
      },
    },
    { status: 404 }
  );
}

export async function PUT(req: NextRequest) {
  const { pathname } = req.nextUrl;
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "ROUTE_NOT_FOUND",
        message: `Route GET ${pathname} not found`,
        statusCode: 404,
        timestamp: new Date().toISOString(),
      },
    },
    { status: 404 }
  );
}

export async function DELETE(req: NextRequest) {
  const { pathname } = req.nextUrl;
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "ROUTE_NOT_FOUND",
        message: `Route GET ${pathname} not found`,
        statusCode: 404,
        timestamp: new Date().toISOString(),
      },
    },
    { status: 404 }
  );
}

export async function PATCH(req: NextRequest) {
  const { pathname } = req.nextUrl;
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "ROUTE_NOT_FOUND",
        message: `Route GET ${pathname} not found`,
        statusCode: 404,
        timestamp: new Date().toISOString(),
      },
    },
    { status: 404 }
  );
}
