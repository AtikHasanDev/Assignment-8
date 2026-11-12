import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";
import "./shell.css";
export const metadata: Metadata = {
  title: {
    default: "StudioSpace | Creative Studio Rentals",
    template: "%s | StudioSpace",
  },
  description:
    "Discover, host, and book creative workspaces and production studios.",
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
