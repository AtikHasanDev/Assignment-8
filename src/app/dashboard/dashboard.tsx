"use client";

import { ArrowUpRight, CalendarDays, LayoutGrid, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { listMyBookings, listMyStudios } from "@/lib/studio-api";

type DashboardCounts = {
  studios: number | null;
  pendingBookings: number | null;
};

export function Dashboard() {
  const { data: session } = authClient.useSession();
  const [counts, setCounts] = useState<DashboardCounts>();
  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();
    Promise.allSettled([
      listMyStudios(controller.signal),
      listMyBookings(controller.signal),
    ]).then(([studios, bookings]) => {
      if (controller.signal.aborted) return;
      setCounts({
        studios: studios.status === "fulfilled" ? studios.value.length : null,
        pendingBookings: bookings.status === "fulfilled"
          ? bookings.value.filter((booking) => booking.status === "Pending").length
          : null,
      });
    });
    return () => controller.abort();
  }, [userId]);

  const cards = [
    {
      title: "My studio listings",
      description: "View, edit, or remove the spaces you host.",
      metric: "Published listings",
      count: counts?.studios,
      href: "/my-listings",
      icon: LayoutGrid,
    },
    {
      title: "My bookings",
      description: "Check the status of your studio reservations.",
      metric: "Pending bookings",
      count: counts?.pendingBookings,
      href: "/my-bookings",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="container pb-16">
      <header className="page-heading flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1>Dashboard</h1>
          {session?.user.name && <p className="muted">Welcome, {session.user.name}.</p>}
        </div>
        <Link href="/add-studio" className="button button-primary">
          <Plus aria-hidden="true" size={18} /> Add new studio
        </Link>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map(({ title, description, metric, count, href, icon: Icon }) => (
          <section className="panel flex flex-col items-start gap-3" key={href}>
            <Icon aria-hidden="true" size={24} className="text-[var(--lime)]" />
            <h2 className="text-2xl">{title}</h2>
            <p className="muted">{description}</p>
            <dl>
              <dt className="muted text-sm">{metric}</dt>
              <dd aria-live="polite" className="font-semibold">
                {count === undefined ? "Loading…" : count ?? "Unavailable"}
              </dd>
            </dl>
            <Link href={href} className="button button-outline mt-auto">
              {title} <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </section>
        ))}
      </div>
    </div>
  );
}
