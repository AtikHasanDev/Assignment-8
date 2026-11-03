import type { Metadata } from "next";
import { Catalogue } from "@/components/catalogue";
import { Suspense } from "react";
export const metadata: Metadata = { title: "All Books" };
export default function BooksPage() {
  return (
    <div className="container">
      <header className="page-heading">
        <p className="eyebrow">The collection</p>
        <h1>Explore the collection.</h1>
        <p className="muted">A world of stories. One place to find them.</p>
      </header>
      <Suspense fallback={<p role="status">Loading the collection…</p>}>
        <Catalogue />
      </Suspense>
    </div>
  );
}
