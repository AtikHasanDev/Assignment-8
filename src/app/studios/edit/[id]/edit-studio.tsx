"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StudioForm } from "@/app/add-studio/studio-form";
import { listMyStudios } from "@/lib/studio-api";
import type { OwnedStudio } from "@/lib/studios";

type EditState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "error"; message: string }
  | { status: "ready"; studio: OwnedStudio };

export function EditStudio({ id }: { id: string }) {
  const [state, setState] = useState<EditState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    listMyStudios(controller.signal).then(
      (studios) => {
        if (controller.signal.aborted) return;
        const studio = studios.find((item) => item._id === id);
        setState(studio ? { status: "ready", studio } : { status: "missing" });
      },
      (error: unknown) => {
        if (!controller.signal.aborted)
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Could not load the listing.",
          });
      },
    );
    return () => controller.abort();
  }, [id, attempt]);

  if (state.status === "loading")
    return (
      <p className="muted flex items-center gap-2" role="status">
        <LoaderCircle aria-hidden="true" className="animate-spin" size={20} /> Loading your listing…
      </p>
    );

  if (state.status === "missing")
    return (
      <section className="empty-state">
        <h2>Listing unavailable</h2>
        <p className="muted">This studio couldn’t be found in your listings.</p>
        <Link className="button button-outline mt-4" href="/my-listings">Go to my listings</Link>
      </section>
    );

  if (state.status === "error")
    return (
      <section className="empty-state" role="alert">
        <h2>Could not load this listing</h2>
        <p>{state.message}</p>
        <button type="button" className="button button-outline mt-4" onClick={() => {
          setState({ status: "loading" });
          setAttempt((current) => current + 1);
        }}>
          Try again
        </button>
      </section>
    );

  return <div className="panel"><StudioForm studio={state.studio} /></div>;
}
