"use client";

import Link from "next/link";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <div className="container section text-center" role="alert">
      <h1>We couldn’t load this page</h1>
      <p className="muted mt-4">Try again or return to the StudioSpace homepage.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" className="button button-primary" onClick={retry}>Try again</button>
        <Link href="/" className="button button-outline">Return to home</Link>
      </div>
    </div>
  );
}
