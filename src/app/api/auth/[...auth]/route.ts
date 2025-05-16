import 'server-only'
import routes from "@/lib/OAuthOptions";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const {
  AUTH_BASE_URI,
  AUTH_CLIENT_ID,
  AUTH_AUTHORIZE_ENDPOINT,
  AUTH_SCOPE,
  AUTH_RESPONSE_TYPE,
  AUTH_GRANT_TYPE,
  AUTH_REDIRECT_URI,
} = process.env;
async function handler(req: Request) {
  const url = new URL(req.url);
  const authurl = url.pathname.split("/").slice(3);
  const method = req.method;
  const action = authurl[0];
  try {
    if (method === "GET") {
      switch (action) {
        case "session":
          return NextResponse.json({ status: "success" });
          break;
        case "signin":
          return NextResponse.redirect(
            `${AUTH_BASE_URI}/${AUTH_AUTHORIZE_ENDPOINT}?client_id=${AUTH_CLIENT_ID}&scope=${AUTH_SCOPE}&response_type=${AUTH_RESPONSE_TYPE}&grant_type=${AUTH_GRANT_TYPE}&redirect_uri=${AUTH_REDIRECT_URI}`
          );
          break;
        case "callback":
          try {
            return routes.callback(req);
          } catch (error) {
            console.log(error);
          }
          break;
        case "error":
          return NextResponse.json({ status: "success" });
          break;
        case "csrf":
          return await routes.csrf();
          break;
      }
    } else if (method === "POST") {
      switch (action) {
        case "signin":
          (await cookies()).set(`${process.env.APP_NAME}.access_token`, "", {
            expires: new Date(0),
            path: "/",
          });
          (await cookies()).set(`${process.env.APP_NAME}.refresh_token`, "", {
            expires: new Date(0),
            path: "/",
          });
          return NextResponse.redirect("/");
          break;
        case "signout":
          return routes.signout();
          break;
        case "session":
          return routes.session();
          break;
      }
    }
    return NextResponse.json({ status: "failed" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed" });
  }
}
export { handler as GET, handler as POST };
