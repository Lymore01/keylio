import { SESSION_KEY } from "@keylio/shared/constants";
import type { GetServerSidePropsContext, NextApiRequest } from "next";
import type { NextRequest } from "next/server";

export interface GetTokenParams<R extends boolean = false> {
  req: GetServerSidePropsContext["req"] | NextApiRequest | NextRequest;
  raw?: R;
  secret?: string;
}

export async function getToken(request?: NextRequest) {
  try {
    const baseUrl = `${request ? request.nextUrl.origin : ""}/api/auth/session`;

    const cookieValue = request.cookies.get(SESSION_KEY as string)?.value ?? "";

    const res = await fetch(baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json", cookie: cookieValue },
    });

    const data = await res.json();
    if (!res.ok) return null;

    return data;
  } catch (err) {
    return null;
  }
}
