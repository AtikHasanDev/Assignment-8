import { LoaderCircle } from "lucide-react";
export default function Loading() {
  return (
    <div
      className="container section flex min-h-80 items-center justify-center gap-3 muted"
      role="status"
    >
      <LoaderCircle className="animate-spin" />
      Opening the next chapter…
    </div>
  );
}
