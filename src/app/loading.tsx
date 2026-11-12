import { Aperture } from "lucide-react";

export default function Loading() {
  return (
    <div className="container section flex min-h-80 items-center justify-center gap-3 muted" role="status">
      <Aperture className="text-primary motion-safe:animate-spin" aria-hidden="true" />
      Loading StudioSpace…
    </div>
  );
}
