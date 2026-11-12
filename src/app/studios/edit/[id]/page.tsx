import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { EditStudio } from "./edit-studio";

export const metadata: Metadata = {
  title: { absolute: "Edit Studio | StudioSpace" },
};

export default async function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) notFound();

  return (
    <AuthGuard>
      <div className="container max-w-4xl pb-16">
        <header className="page-heading">
          <Link className="muted mb-3 inline-block hover:underline" href="/my-listings">
            Back to my listings
          </Link>
          <h1>Edit studio</h1>
          <p className="muted">Update the details creators see when browsing your space.</p>
        </header>
        <EditStudio key={id} id={id.toLowerCase()} />
      </div>
    </AuthGuard>
  );
}
