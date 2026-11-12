import { Camera, Lightbulb, Video } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container section min-h-[60vh] text-center">
      <div className="relative mx-auto mb-7 flex h-36 w-60 items-center justify-center overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] text-primary" aria-hidden="true">
        <div className="absolute inset-x-0 bottom-6 border-t border-[var(--line)]" />
        <Lightbulb className="absolute left-8 top-5 -rotate-12 opacity-60" size={32} strokeWidth={1.5} />
        <Video className="absolute bottom-8 right-7 rotate-6 opacity-60" size={29} strokeWidth={1.5} />
        <Camera size={72} strokeWidth={1.35} />
      </div>
      <p className="muted mb-2">404</p>
      <h1>Page not found</h1>
      <p className="muted mt-4">The page may have moved, or the studio listing may have been removed.</p>
      <Link href="/" className="button button-primary mt-6">Return to home</Link>
    </div>
  );
}
