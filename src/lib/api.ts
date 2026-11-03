"use client";
import { authClient } from "./auth-client";
export const apiConfigured = Boolean(process.env.NEXT_PUBLIC_API_URL);
export async function api<T>(
  path: string,
  options: RequestInit = {},
  protectedRoute = false,
): Promise<T> {
  if (!process.env.NEXT_PUBLIC_API_URL)
    throw new Error("The library service is not connected yet.");
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  if (protectedRoute) {
    const { data, error } = await authClient.token();
    if (error || !data?.token)
      throw new Error("Please log in again to continue.");
    headers.set("Authorization", `Bearer ${data.token}`);
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}${path}`,
    { ...options, headers },
  );
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(body.message || "Something went wrong. Please try again.");
  return body;
}
