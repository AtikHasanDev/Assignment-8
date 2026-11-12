import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth-guard";
import { StudioForm } from "./studio-form";

export const metadata: Metadata = {
  title: { absolute: "Add New Studio | StudioSpace" },
};

export default function AddStudioPage() {
  return (
    <AuthGuard>
      <div className="container max-w-4xl pb-16">
        <header className="page-heading">
          <h1>Add a studio</h1>
          <p className="muted">Share your space, equipment, and hourly rate with creators.</p>
        </header>
        <div className="panel">
          <StudioForm />
        </div>
      </div>
    </AuthGuard>
  );
}
