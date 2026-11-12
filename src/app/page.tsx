import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { FeaturedStudios } from "./featured-studios";
import { StudioHomeSections } from "./studio-home-sections";
import "./studios/studios.css";

export const metadata: Metadata = {
  title: { absolute: "StudioSpace | Creative Studio Rentals" },
  description: "Find and book creative spaces for your next shoot, recording, or workshop.",
};

export default function Home() {
  return (
    <div className="container py-6 sm:py-10">
      <Hero />
      <FeaturedStudios />
      <StudioHomeSections />
    </div>
  );
}
