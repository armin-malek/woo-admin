import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const protectedAPIRoutes = ["/api/cp", "/api/shop"];
const protectedRoutes = ["/shop", "/bulk", "/cp"];
export async function middleware(req) {
  // return early if url isn't supposed to be protected
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.pathname;

  if (url.startsWith("/api")) {
    // must login for the protected routes
    for (let route of protectedAPIRoutes) {
      if (req.nextUrl.pathname.startsWith(route) && !session) {
        return new NextResponse(
          JSON.stringify({
            status: false,
            msg: "باید وارد حساب خود شده باشید!",
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }
    }
  }

  // normal routes
  for (let route of protectedRoutes) {
    if (url.startsWith(route) && !session) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  return NextResponse.next();
}
