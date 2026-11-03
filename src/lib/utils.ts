import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function safeReturnPath(value: string | null) {
  return value &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\")
    ? value
    : "/";
}
export function passwordError(value: string) {
  return value.length < 6 || !/[A-Z]/.test(value) || !/[a-z]/.test(value)
    ? "Use at least 6 characters, including an uppercase and a lowercase letter."
    : "";
}
