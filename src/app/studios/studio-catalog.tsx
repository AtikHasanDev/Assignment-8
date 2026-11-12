"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listStudios } from "@/lib/studio-api";
import { studioCategories, type Studio, type StudioCategory } from "@/lib/studios";
import { StudioCard } from "./studio-card";

type CatalogState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; studios: Studio[] };

export function StudioCatalog({ category }: { category?: StudioCategory }) {
  const [state, setState] = useState<CatalogState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    listStudios({ category }, controller.signal).then(
      (studios) => {
        if (!controller.signal.aborted) setState({ status: "ready", studios });
      },
      (error: unknown) => {
        if (!controller.signal.aborted)
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Could not load studios.",
          });
      },
    );
    return () => controller.abort();
  }, [category, attempt]);

  return (
    <>
      <nav aria-label="Filter studios by category" className="studio-filters">
        <Link href="/studios" aria-current={category === undefined ? "page" : undefined}>
          All studios
        </Link>
        {studioCategories.map((value) => (
          <Link key={value} href={`/studios?category=${encodeURIComponent(value)}`}
            aria-current={category === value ? "page" : undefined}>
            {value}
          </Link>
        ))}
      </nav>
      {state.status === "loading" && (
        <div className="studio-grid" role="status" aria-label="Loading studios">
          {[0, 1, 2].map((item) => (
            <div key={item} className="studio-card-placeholder" aria-hidden="true" />
          ))}
        </div>
      )}
      {state.status === "error" && (
        <div className="empty-state studio-catalog-message" role="alert">
          <h2>Studios are temporarily unavailable</h2>
          <p>{state.message}</p>
          <button className="button button-outline" type="button"
            onClick={() => {
              setState({ status: "loading" });
              setAttempt((current) => current + 1);
            }}>
            Try again
          </button>
        </div>
      )}
      {state.status === "ready" && state.studios.length > 0 && (
        <div className="studio-grid">
          {state.studios.map((studio) => <StudioCard key={studio._id} studio={studio} />)}
        </div>
      )}
      {state.status === "ready" && state.studios.length === 0 && (
        <div className="empty-state studio-catalog-message">
          <h2>No studios found</h2>
          <p>{category ? "Try browsing all studio categories." : "Check back for new listings."}</p>
          <Link className="button button-outline" href={category ? "/studios" : "/"}>
            {category ? "Browse all studios" : "Return home"}
          </Link>
        </div>
      )}
    </>
  );
}
