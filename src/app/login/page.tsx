import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
export const metadata = { title: "Login" };
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <p className="container section" role="status">
          Loading login…
        </p>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
