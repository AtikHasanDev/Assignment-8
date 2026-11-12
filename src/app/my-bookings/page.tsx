import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth-guard";
import { MyBookings } from "./my-bookings";
import "./my-bookings.css";

export const metadata: Metadata = {
  title: { absolute: "My Bookings | StudioSpace" },
};

export default function MyBookingsPage() {
  return (
    <AuthGuard>
      <div className="container studio-bookings">
        <header>
          <h1>My bookings</h1>
          <p className="muted">View your studio reservations and their status.</p>
        </header>
        <MyBookings />
      </div>
    </AuthGuard>
  );
}
