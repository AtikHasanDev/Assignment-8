import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";
import { passwordError } from "@/lib/utils";
async function handle(request: Request) {
  if (
    !process.env.MONGODB_URI ||
    !process.env.BETTER_AUTH_SECRET ||
    !process.env.BETTER_AUTH_URL
  ) {
    if (new URL(request.url).pathname.endsWith("/get-session"))
      return Response.json(null);
    return Response.json(
      {
        message: "Sign-in is temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  }
  if (
    request.method === "POST" &&
    new URL(request.url).pathname.endsWith("/sign-up/email")
  ) {
    const data = await request
      .clone()
      .json()
      .catch(() => null);
    if (
      !data ||
      typeof data.password !== "string" ||
      passwordError(data.password)
    )
      return Response.json({ message: passwordError("") }, { status: 400 });
  }
  const handlers = toNextJsHandler(getAuth());
  return request.method === "GET"
    ? handlers.GET(request)
    : handlers.POST(request);
}
export { handle as GET, handle as POST };
