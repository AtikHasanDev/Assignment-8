import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
export const metadata = { title: "Register" };
export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <p className="container section" role="status">
          Loading registration…
        </p>
      }
    >
      <AuthForm register />
    </Suspense>
  );
}
