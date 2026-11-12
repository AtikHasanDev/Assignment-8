import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudioDetails } from "./studio-details";
import "./studio-details.css";

export const metadata: Metadata = {
  title: { absolute: "Studio Details | StudioSpace" },
};

export default async function StudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) notFound();
  return <StudioDetails key={id} id={id} />;
}
