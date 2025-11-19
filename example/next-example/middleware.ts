import { NextRequest, NextResponse } from "next/server";
import { getToken } from "../../packages/react/src/utils/index";

const privateRoutePattern = /^\/protected(\/|$)/;
const publicRoutePattern = /^\/auth(\/|$)/;

export async function middleware(req: NextRequest) {
  const response = (await middlewareAuth(req)) ?? NextResponse.next();
  return response;
}

export async function middlewareAuth(request: NextRequest) {
  if (privateRoutePattern.test(request.nextUrl.pathname)) {
    return handlePrivateRoutes(request);
  }
  if (publicRoutePattern.test(request.nextUrl.pathname)) {
    return handlePublicRoutes(request);
  }
}

export async function handlePrivateRoutes(request: NextRequest) {
  const token = await getToken(request);
  console.log("Token in middleware:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
}

export async function handlePublicRoutes(request: NextRequest) {
  const token = await getToken(request);
  console.log("Token in middleware:", token);

  if (token) {
    return NextResponse.redirect(new URL("/protected", request.url));
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and static assets, unless found in search params
    "/((?!_next|api/auth|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Optionally include trpc if you're using it
    "/(api|trpc)(.*)",
  ],
};
