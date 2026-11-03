"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LoaderCircle } from "lucide-react";
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data, isPending, error } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!isPending && !data && !error)
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
  }, [data, isPending, error, pathname, router]);
  if (error)
    return (
      <div className="container section empty-state">
        <h2>We couldn’t check your session</h2>
        <p className="muted">Please refresh the page and try again.</p>
      </div>
    );
  if (isPending || !data)
    return (
      <div
        role="status"
        className="flex min-h-80 items-center justify-center gap-3"
      >
        <LoaderCircle className="animate-spin" /> Checking your session…
      </div>
    );
  return children;
}
