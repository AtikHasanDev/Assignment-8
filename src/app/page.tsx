import type { Metadata } from "next";
import { Hero } from "@/components/hero";

export const metadata: Metadata = {
  title: { absolute: "StudioSpace | Creative Studio Rentals" },
  description: "Find and book creative spaces for your next shoot, recording, or workshop.",
};

export default function Home() {
  return (
    <div className="container py-6 sm:py-10">
      <Hero />
    </div>
  );
}
