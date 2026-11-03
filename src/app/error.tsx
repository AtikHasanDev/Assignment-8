"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container section empty-state">
      <h1 className="text-4xl">A little interruption.</h1>
      <p className="muted mt-5 mb-7">
        We couldn’t open this page. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
