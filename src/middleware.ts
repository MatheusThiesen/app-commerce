import { NextRequest, NextResponse } from "next/server";
import { getUrl } from "./lib/get-url";

export const ROUTE_HOME = "/carregando";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("nextauth.token");
  const pathname = request.nextUrl.pathname;

  const [, firstPath] = pathname.split("/");

  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL(getUrl(ROUTE_HOME)));
  }

  if (
    !["/", "/esquecido", "/catalogo", "/resetar"].includes("/" + firstPath) &&
    !token
  ) {
    return NextResponse.redirect(new URL(getUrl("/")));
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
