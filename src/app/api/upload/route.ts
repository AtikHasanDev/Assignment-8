import { getAuth } from "@/lib/auth";
export async function POST(request: Request) {
  if (
    !process.env.MONGODB_URI ||
    !process.env.BETTER_AUTH_SECRET ||
    !process.env.IMGBB_API_KEY
  )
    return Response.json(
      { message: "Image uploads are temporarily unavailable." },
      { status: 503 },
    );
  const session = await getAuth().api.getSession({ headers: request.headers });
  if (!session)
    return Response.json(
      { message: "Please log in to upload a cover." },
      { status: 401 },
    );
  if (Number(request.headers.get("content-length")) > 6 * 1024 * 1024)
    return Response.json(
      { message: "Choose an image smaller than 5 MB." },
      { status: 413 },
    );
  const data = await request.formData();
  const file = data.get("image");
  if (
    !(file instanceof File) ||
    file.size > 5 * 1024 * 1024 ||
    !["image/jpeg", "image/png", "image/webp"].includes(file.type)
  )
    return Response.json(
      { message: "Choose a JPG, PNG, or WebP image under 5 MB." },
      { status: 400 },
    );
  const upload = new FormData();
  upload.set("image", file);
  try {
    const result = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(process.env.IMGBB_API_KEY)}`,
      { method: "POST", body: upload, signal: AbortSignal.timeout(30000) },
    );
    const body = await result.json();
    if (!result.ok || !body.success || !body.data?.url)
      throw new Error("Upload failed");
    return Response.json({ url: body.data.url });
  } catch {
    return Response.json(
      { message: "The cover could not be uploaded. Please try again." },
      { status: 502 },
    );
  }
}
