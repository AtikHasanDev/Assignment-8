"use client";

import { LoaderCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { deleteStudio, listMyStudios } from "@/lib/studio-api";
import type { OwnedStudio } from "@/lib/studios";

const hourlyPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

type ListingState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; studios: OwnedStudio[] };

export function MyListings() {
  const [state, setState] = useState<ListingState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState<OwnedStudio>();
  const [deleting, setDeleting] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    listMyStudios(controller.signal).then(
      (studios) => {
        if (!controller.signal.aborted) setState({ status: "ready", studios });
      },
      (error: unknown) => {
        if (!controller.signal.aborted)
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Could not load your listings.",
          });
      },
    );
    return () => controller.abort();
  }, [attempt]);

  async function remove() {
    if (!selected || deleting) return;
    setDeleting(true);
    try {
      await deleteStudio(selected._id);
      dialog.current?.close();
      setState((current) => current.status === "ready"
        ? { status: "ready", studios: current.studios.filter((studio) => studio._id !== selected._id) }
        : current);
      toast.success("Studio listing deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete this studio.");
    } finally {
      setDeleting(false);
    }
  }

  if (state.status === "loading")
    return <p className="muted flex items-center gap-2" role="status">
      <LoaderCircle aria-hidden="true" className="animate-spin" size={20} /> Loading your listings…
    </p>;

  if (state.status === "error")
    return (
      <div className="empty-state" role="alert">
        <h2>Could not load your listings</h2>
        <p>{state.message}</p>
        <button type="button" className="button button-outline mt-4" onClick={() => {
          setState({ status: "loading" });
          setAttempt((current) => current + 1);
        }}>Try again</button>
      </div>
    );

  if (state.studios.length === 0)
    return (
      <div className="empty-state">
        <h2>No listings yet</h2>
        <p className="muted">Publish a studio to make it visible in the catalog.</p>
        <Link href="/add-studio" className="button button-primary mt-4">Add a studio</Link>
      </div>
    );

  return (
    <>
      <ul className="grid gap-4">
        {state.studios.map((studio) => (
          <li key={studio._id} className="panel flex flex-wrap items-center justify-between gap-5">
            <div className="min-w-0">
              <p className="muted text-sm">{studio.category}</p>
              <h2 className="mt-1 break-words text-2xl">
                <Link href={`/studios/${studio._id}`} className="hover:underline">{studio.title}</Link>
              </h2>
              <p className="muted mt-2 flex items-center gap-2">
                <MapPin aria-hidden="true" size={16} className="shrink-0" /> {studio.location}
              </p>
              <p className="mt-1">{hourlyPrice.format(studio.hourlyRate)} / hr</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/studios/edit/${studio._id}`} className="button button-outline"
                aria-label={`Edit ${studio.title}`}>Edit</Link>
              <button type="button" className="button button-danger" aria-label={`Delete ${studio.title}`}
                onClick={() => {
                  setSelected(studio);
                  dialog.current?.showModal();
                }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <dialog ref={dialog} className="panel fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[30rem] max-w-[calc(100%_-_2rem)] overflow-auto text-inherit backdrop:bg-black/70"
        aria-labelledby="studio-delete-title" aria-describedby="studio-delete-description"
        onClose={() => setSelected(undefined)}
        onCancel={(event) => { if (deleting) event.preventDefault(); }}>
        <h2 className="text-2xl" id="studio-delete-title">Delete this studio?</h2>
        <p className="muted mt-3 break-words" id="studio-delete-description">
          {selected?.title} will be removed from the public catalog.
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" className="button button-outline" disabled={deleting}
            onClick={() => dialog.current?.close()}>Keep studio</button>
          <button type="button" className="button button-danger" disabled={deleting}
            onClick={() => void remove()}>{deleting ? "Deleting…" : "Delete studio"}</button>
        </div>
      </dialog>
    </>
  );
}
