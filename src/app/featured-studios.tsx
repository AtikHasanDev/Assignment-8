"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { listStudios } from "@/lib/studio-api";
import type { Studio } from "@/lib/studios";
import { StudioCard } from "./studios/studio-card";

type FeaturedState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; studios: Studio[] };

export function FeaturedStudios() {
  const [state, setState] = useState<FeaturedState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    listStudios({ limit: 6 }, controller.signal).then(
      (studios) => {
        if (!controller.signal.aborted) setState({ status: "ready", studios });
      },
      () => {
        if (!controller.signal.aborted) setState({ status: "error" });
      },
    );
    return () => controller.abort();
  }, [attempt]);

  return (
    <section className="section" aria-labelledby="featured-studios-title">
      <header className="section-heading">
        <h2 id="featured-studios-title">Featured studios</h2>
        <Link href="/studios" className="button button-outline">
          View all studios <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </header>
      {state.status === "loading" && (
        <div className="studio-grid" role="status" aria-label="Loading featured studios">
          {[0, 1, 2].map((item) => (
            <div className="studio-card-placeholder" key={item} aria-hidden="true" />
          ))}
        </div>
      )}
      {state.status === "error" && (
        <div className="empty-state studio-catalog-message" role="alert">
          <p>Featured studios are temporarily unavailable.</p>
          <button type="button" className="button button-outline" onClick={() => {
            setState({ status: "loading" });
            setAttempt((current) => current + 1);
          }}>
            Try again
          </button>
        </div>
      )}
      {state.status === "ready" && state.studios.length === 0 && (
        <div className="empty-state">
          <p className="muted">New studio listings will appear here.</p>
        </div>
      )}
      {state.status === "ready" && state.studios.length > 0 && (
        <div className="studio-grid">
          {state.studios.map((studio) => <StudioCard key={studio._id} studio={studio} />)}
        </div>
      )}
    </section>
  );
}
