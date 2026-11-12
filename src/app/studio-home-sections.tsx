import { ArrowUpRight, AudioLines, Camera, Clapperboard, Mic, Paintbrush } from "lucide-react";
import Link from "next/link";
import type { StudioCategory } from "@/lib/studios";

const categories = [
  { category: "Photo Studio", label: "Photo studios", icon: Camera },
  { category: "Film Stage", label: "Sound stages", icon: Clapperboard },
  { category: "Podcast Lounge", label: "Podcast rooms", icon: Mic },
  { category: "Music Suite", label: "Music suites", icon: AudioLines },
  { category: "Workshop", label: "Art workshops", icon: Paintbrush },
] satisfies { category: StudioCategory; label: string; icon: typeof Camera }[];

const steps = [
  { title: "Discover spaces", detail: "Compare studios by category, location, and hourly rate." },
  { title: "Select shoot hours", detail: "Choose a start and end time that fits your production." },
  { title: "Request a booking", detail: "Submit your time slot and check My Bookings for confirmation." },
  { title: "Create and produce", detail: "Once confirmed, coordinate access with your host and get to work." },
];

const support = [
  { title: "Liability and deposits", detail: "Review the deposit, liability terms, and any production insurance you need before booking." },
  { title: "Host profiles", detail: "Check the listing’s host and any available verification details before you reserve." },
  { title: "Equipment safety", detail: "Confirm which gear is included and ask the host about setup and safe operation." },
  { title: "Creator support", detail: "Keep your booking details handy if you need help with access, equipment, or a reservation." },
];

export function StudioHomeSections() {
  return (
    <>
      <section className="pb-14" aria-labelledby="studio-categories">
        <h2 id="studio-categories" className="mb-6">Browse by studio category</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map(({ category, label, icon: Icon }) => (
            <li key={category}>
              <Link
                href={`/studios?category=${encodeURIComponent(category)}`}
                className="flex h-full flex-col gap-3 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 hover:border-[var(--lime)]"
              >
                <Icon aria-hidden="true" size={23} className="text-[var(--lime)]" />
                <span className="flex items-center justify-between gap-1 font-semibold">
                  {label}<ArrowUpRight aria-hidden="true" size={16} className="shrink-0" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section id="how-it-works" className="panel mb-8 scroll-mt-24" aria-labelledby="booking-steps">
        <h2 id="booking-steps" className="mb-6">How booking works</h2>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ title, detail }, index) => (
            <li key={title} className="border-t border-[var(--line)] pt-4">
              <span aria-hidden="true" className="mb-2 block font-semibold text-[var(--lime)]">{index + 1}</span>
              <h3>{title}</h3>
              <p className="muted mt-2">{detail}</p>
            </li>
          ))}
        </ol>
      </section>
      <section id="about" className="panel scroll-mt-24" aria-labelledby="studio-support">
        <h2 id="studio-support" className="mb-6">Host and creator support</h2>
        <ul className="grid gap-6 sm:grid-cols-2">
          {support.map(({ title, detail }) => (
            <li key={title}>
              <h3>{title}</h3>
              <p className="muted mt-2">{detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
