"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { createBooking, StudioApiError } from "@/lib/studio-api";
import type { Studio } from "@/lib/studios";

export function StudioBooking({ studio }: { studio: Studio }) {
  const { data: session, isPending, error: sessionError } = authClient.useSession();
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const returnTo = encodeURIComponent(`/studios/${studio._id}`);
  const login = `/login?returnTo=${returnTo}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const form = event.currentTarget;
    const values = new FormData(form);
    const startsAt = new Date(String(values.get("startsAt") ?? ""));
    const endsAt = new Date(String(values.get("endsAt") ?? ""));

    if (!(startsAt.getTime() > Date.now() && endsAt > startsAt)) {
      setError("Choose a future start time and a later end time.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      await createBooking({
        studioId: studio._id,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
      });
      form.reset();
      dialog.current?.close();
      toast.success("Booking requested. Your reservation is pending.");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Could not request this booking.";
      setError(message);
      toast.error(message);
      if (reason instanceof StudioApiError && reason.status === 401) {
        dialog.current?.close();
        router.push(login);
      }
    } finally {
      setBusy(false);
    }
  }

  if (!session && !isPending && !sessionError)
    return <Link className="button button-primary studio-booking-trigger" href={login}>Log in to book</Link>;

  return (
    <>
      <button
        type="button"
        className="button button-primary studio-booking-trigger"
        disabled={isPending}
        onClick={() => {
          setError("");
          dialog.current?.showModal();
        }}
      >
        {isPending ? "Checking your session…" : "Book workspace now"}
      </button>
      <dialog
        ref={dialog}
        className="studio-booking-dialog panel"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
      >
        <h2 id={titleId}>Book {studio.title}</h2>
        <p id={descriptionId} className="muted">
          Times use your device’s local time. Your request will be pending until confirmed.
        </p>
        <form className="form-grid" onSubmit={submit}>
          <label className="field">
            Starts at
            <input type="datetime-local" name="startsAt" required disabled={busy} />
          </label>
          <label className="field">
            Ends at
            <input type="datetime-local" name="endsAt" required disabled={busy} />
          </label>
          {error && <p className="error-message" role="alert">{error}</p>}
          <div className="studio-booking-actions">
            <button type="button" className="button button-outline" disabled={busy}
              onClick={() => dialog.current?.close()}>
              Close
            </button>
            <button type="submit" className="button button-primary" disabled={busy}>
              {busy ? "Requesting…" : "Request booking"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
