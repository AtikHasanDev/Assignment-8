import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

const tokenCookie = "studiospace_token";
const routePath = "/api/studiospace";
const studioPath = /^studios\/[a-f\d]{24}$/i;
const cancellationPath = /^bookings\/[a-f\d]{24}\/cancel$/i;

function accessFor(method: string, path: string) {
  if (method === "GET") {
    if (path === "studios" || studioPath.test(path)) return "public";
    if (path === "studios/mine" || path === "bookings") return "private";
  }
  if (method === "POST" && (path === "studios" || path === "bookings"))
    return "private";
  if (method === "PATCH" && (studioPath.test(path) || cancellationPath.test(path)))
    return "private";
  if (method === "DELETE" && studioPath.test(path)) return "private";
}

function problem(status: number, message: string) {
  return NextResponse.json(
    { message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

async function forward(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const endpoint = path.join("/");
  const access = accessFor(request.method, endpoint);
  if (!access) return problem(404, "This StudioSpace endpoint does not exist.");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return problem(503, "The StudioSpace API is unavailable.");

  try {
    const headers = new Headers();
    const contentType = request.headers.get("content-type");
    if (contentType) headers.set("Content-Type", contentType);

    let token: string | undefined;
    if (access === "private") {
      const authUrl = process.env.BETTER_AUTH_URL;
      if (!authUrl) return problem(503, "Sign-in is temporarily unavailable.");
      if (
        request.method !== "GET" &&
        request.headers.get("origin") !== new URL(authUrl).origin
      )
        return problem(403, "This request must originate from StudioSpace.");

      const authResponse = await getAuth().api.getToken({
        headers: request.headers,
        asResponse: true,
      });
      if (authResponse.status === 401)
        return problem(401, "Please log in to continue.");
      if (!authResponse.ok)
        return problem(503, "Sign-in is temporarily unavailable.");

      const signed = (await authResponse.json()) as { token?: unknown };
      if (typeof signed.token !== "string" || !signed.token)
        return problem(503, "Sign-in is temporarily unavailable.");
      token = signed.token;
      headers.set("Cookie", `${tokenCookie}=${token}`);
    }

    const search = new URL(request.url).search;
    const upstream = await fetch(`${apiUrl.replace(/\/$/, "")}/api/${endpoint}${search}`, {
      method: request.method,
      headers,
      body: request.body ? await request.arrayBuffer() : undefined,
      cache: "no-store",
      redirect: "error",
    });

    const responseHeaders = new Headers({ "Cache-Control": "no-store" });
    const upstreamType = upstream.headers.get("content-type");
    if (upstreamType) responseHeaders.set("Content-Type", upstreamType);
    const response = new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
    if (token) {
      response.cookies.set(tokenCookie, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: routePath,
        maxAge: 300,
      });
    }
    return response;
  } catch {
    return problem(503, "StudioSpace is temporarily unavailable. Please try again.");
  }
}

export { forward as GET, forward as POST, forward as PATCH, forward as DELETE };
