import type { Metadata } from "next";
import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { MyListings } from "./my-listings";

export const metadata: Metadata = {
  title: { absolute: "My Studio Listings | StudioSpace" },
};

export default function MyListingsPage() {
  return (
    <AuthGuard>
      <div className="container pb-16">
        <header className="page-heading flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1>My studio listings</h1>
            <p className="muted">Manage the spaces you share with creators.</p>
          </div>
          <Link href="/add-studio" className="button button-primary">Add new studio</Link>
        </header>
        <MyListings />
      </div>
    </AuthGuard>
  );
}
