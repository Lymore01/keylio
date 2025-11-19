import { GetServerSidePropsContext, NextApiRequest } from "next";
import { NextRequest } from "next/server";

export interface GetTokenParams<R extends boolean = false> {
  req: GetServerSidePropsContext["req"] | NextApiRequest | NextRequest;
  raw?: R;
  secret?: string;
}

export async function getToken(request?: NextRequest) {
  try {
    const baseUrl = `${request.nextUrl.origin}/api/auth/session`;

    const res = await fetch(baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) return null;
    return data;
  } catch (err) {
    return null;
  }
}

