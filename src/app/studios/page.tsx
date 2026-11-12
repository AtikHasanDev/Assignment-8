import type { Metadata } from "next";
import { studioCategories } from "@/lib/studios";
import { StudioCatalog } from "./studio-catalog";
import "./studios.css";

export const metadata: Metadata = {
  title: { absolute: "Explore Studios | StudioSpace" },
};

export default async function StudiosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await searchParams;
  const selected = studioCategories.find((value) => value === category);

  return (
    <div className="container studio-explore">
      <header>
        <h1>Explore studios</h1>
        <p className="muted">Find a space for your next shoot, recording, or workshop.</p>
      </header>
      <StudioCatalog key={selected ?? "all"} category={selected} />
    </div>
  );
}
