import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { OAuth2 } from "@/lib/OAuthOptions";

const {
  AUTH_BASE_URI,
  AUTH_CLIENT_ID,
  AUTH_AUTHORIZE_ENDPOINT,
  AUTH_SCOPE,
  AUTH_RESPONSE_TYPE,
  AUTH_GRANT_TYPE,
  AUTH_REDIRECT_URI,
} = process.env;
async function handler(req: NextRequest) {
  const url = new URL(req.url);
  const authurl = url.pathname.split("/").slice(3);
  const method = req.method;
  const action = authurl[0];
  try {
    if (method === "GET") {
      switch (action) {
        case "signin":
          return NextResponse.redirect(
            `${AUTH_BASE_URI}/${AUTH_AUTHORIZE_ENDPOINT}?client_id=${AUTH_CLIENT_ID}&scope=${AUTH_SCOPE}&response_type=${AUTH_RESPONSE_TYPE}&grant_type=${AUTH_GRANT_TYPE}&redirect_uri=${AUTH_REDIRECT_URI}`
          );
          break;
        case "callback":
          return OAuth2.callback(req);
          break;
        case "csrf":
          return await OAuth2.csrf();
          break;
      }
    } else if (method === "POST") {
      switch (action) {
        case "signout":
          try {
            const response = await OAuth2.signout();
            return NextResponse.json({ status: "success", message: response });
          } catch (error) {
            return NextResponse.json(
              { status: "failed", error },
              { status: 401 }
            );
          }
          break;
        case "session":
          try {
            const session = await OAuth2.session();
            return NextResponse.json({
              status: "success",
              user: session.user,
              account: session.account,
            });
          } catch (error) {
            console.log(error === "Token expired");
            if (error === "Token expired") {
              return NextResponse.redirect(new URL(req.url));
            }
            return NextResponse.json(
              { status: "failed", error },
              { status: 401 }
            );
          }
          break;
      }
    }
    return NextResponse.json({ status: "not found" }, { status: 404 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed" }, { status: 500 });
  }
}
export { handler as GET, handler as POST };
