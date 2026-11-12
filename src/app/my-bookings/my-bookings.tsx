"use client";

import { CalendarDays, LoaderCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cancelBooking, listMyBookings } from "@/lib/studio-api";
import type { Booking } from "@/lib/studios";

const dateTime = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

type BookingList =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; bookings: Booking[] };

export function MyBookings() {
  const [state, setState] = useState<BookingList>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [cancelling, setCancelling] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();
    listMyBookings(controller.signal).then(
      (bookings) => {
        if (!controller.signal.aborted) setState({ status: "ready", bookings });
      },
      (error: unknown) => {
        if (!controller.signal.aborted)
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Could not load your bookings.",
          });
      },
    );
    return () => controller.abort();
  }, [attempt]);

  function reload() {
    setState({ status: "loading" });
    setAttempt((current) => current + 1);
  }

  async function cancel(id: string) {
    if (cancelling) return;
    setCancelling(id);
    try {
      const updated = await cancelBooking(id);
      setState((current) => current.status === "ready"
        ? {
            status: "ready",
            bookings: current.bookings.map((booking) => booking._id === id ? updated : booking),
          }
        : current);
      toast.success("Booking cancelled.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel your booking.");
    } finally {
      setCancelling(undefined);
    }
  }

  if (state.status === "loading")
    return <p className="studio-bookings-loading" role="status">
      <LoaderCircle className="animate-spin" aria-hidden="true" size={20} /> Loading your bookings…
    </p>;

  if (state.status === "error")
    return (
      <div className="empty-state" role="alert">
        <h2>Could not load your bookings</h2>
        <p>{state.message}</p>
        <button type="button" className="button button-outline" onClick={reload}>Try again</button>
      </div>
    );

  if (state.bookings.length === 0)
    return (
      <div className="empty-state">
        <h2>No bookings yet</h2>
        <p className="muted">Find a space and reserve a time for your next project.</p>
        <Link href="/studios" className="button button-primary">Explore studios</Link>
      </div>
    );

  return (
    <ul className="studio-bookings-list">
      {state.bookings.map((booking) => (
        <li key={booking._id} className="panel studio-booking-row">
          <div>
            <h2><Link href={`/studios/${booking.studioId}`}>{booking.studioTitle}</Link></h2>
            <p className="studio-booking-meta">
              <MapPin aria-hidden="true" size={16} /> {booking.studioLocation}
            </p>
            <p className="studio-booking-meta">
              <CalendarDays aria-hidden="true" size={16} />
              <span>
                <time dateTime={booking.startsAt}>{dateTime.format(new Date(booking.startsAt))}</time>
                {" – "}
                <time dateTime={booking.endsAt}>{dateTime.format(new Date(booking.endsAt))}</time>
              </span>
            </p>
          </div>
          <div className="studio-booking-status-area">
            <span className="studio-booking-badge" data-status={booking.status}>{booking.status}</span>
            {booking.status === "Pending" && (
              <button type="button" className="button button-outline" disabled={Boolean(cancelling)}
                onClick={() => void cancel(booking._id)}>
                {cancelling === booking._id ? "Cancelling…" : "Cancel booking"}
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
