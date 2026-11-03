import Link from "next/link";
import { BookOpen } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
export const metadata = { title: "Page Not Found" };
export default function NotFound() {
  return (
    <div className="container section text-center min-h-[60vh]">
      <BookOpen
        className="mx-auto text-primary mb-8"
        size={60}
        strokeWidth={1}
      />
      <p className="eyebrow">404 / A missing chapter</p>
      <h1>
        This page slipped
        <br />
        between the covers.
      </h1>
      <p className="muted mt-6 mb-8">Let’s get you back to a story we know.</p>
      <Link href="/" className={buttonVariants()}>
        Back to home
      </Link>
    </div>
  );
}
