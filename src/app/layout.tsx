import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";
import "./shell.css";
export const metadata: Metadata = {
  title: {
    default: "BookNook | A little library for big imaginations",
    template: "BookNook | %s",
  },
  description:
    "Discover your next story. Add, borrow, and share books with the BookNook reading community.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
