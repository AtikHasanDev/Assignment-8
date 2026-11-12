"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Aperture, ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { passwordError, safeReturnPath } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "sonner";
import "./auth-form.css";
export function AuthForm({ register = false }: { register?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = safeReturnPath(params.get("returnTo"));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    const validationError = register ? passwordError(password) : "";
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = register
        ? await authClient.signUp.email({
            name: String(form.get("name")),
            email: String(form.get("email")),
            password,
            image: String(form.get("image")) || undefined,
          })
        : await authClient.signIn.email({
            email: String(form.get("email")),
            password,
          });
      if (result.error)
        throw new Error(
          result.error.message || "Unable to continue. Please try again.",
        );
      toast.success(
        register
          ? "Your account is ready. Please log in."
          : "Welcome back to StudioSpace.",
      );
      router.push(
        register ? `/login?returnTo=${encodeURIComponent(returnTo)}` : returnTo,
      );
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to connect. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }
  async function google() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: register ? "/" : returnTo,
      });
      if (error)
        throw new Error(error.message || "Google sign-in is unavailable.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google sign-in is unavailable.";
      setError(message);
      toast.error(message);
      setBusy(false);
    }
  }
  return (
    <div className="container auth-layout">
      <aside className="auth-aside">
        <Aperture size={80} strokeWidth={1} className="auth-illustration" aria-hidden="true" />
        <h2>Find a space for your next production.</h2>
        <p className="muted">Book creative studios by the hour or list a workspace of your own.</p>
      </aside>
      <section className="panel auth-panel">
        <h1>{register ? "Create your account" : "Log in"}</h1>
        <p className="muted mt-3 mb-7">
          {register ? "Join StudioSpace to host a studio or request a booking." : "Access your StudioSpace listings and bookings."}
        </p>
        <form onSubmit={submit} className="form-grid">
          {register && (
            <label className="field">
              Your name
              <input
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                placeholder="Your full name"
              />
            </label>
          )}
          <label className="field">
            Email address
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>
          {register && (
            <label className="field">
              Photo URL
              <input name="image" type="url" placeholder="https://…" />
            </label>
          )}
          <label className="field">
            Password
            <div className="password-field">
              <input
                name="password"
                type={show ? "text" : "password"}
                required
                minLength={6}
                maxLength={128}
                autoComplete={register ? "new-password" : "current-password"}
                aria-describedby={register ? "password-hint" : undefined}
              />
              <button
                type="button"
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          {register ? (
            <p id="password-hint" className="muted text-xs -mt-3">
              At least 6 characters, with an uppercase and a lowercase letter.
            </p>
          ) : (
            <button
              type="button"
              className="text-xs text-left text-primary"
              onClick={() =>
                toast.info(
                  "Password reset is unavailable. Please use your existing password.",
                )
              }
            >
              Forgot password?
            </button>
          )}
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          <Button disabled={busy}>
            {busy ? "Please wait…" : register ? "Create account" : "Log in"}
            <ArrowUpRight size={16} />
          </Button>
        </form>
        <div className="auth-divider">or</div>
        <Button
          variant="outline"
          className="w-full"
          disabled={busy}
          onClick={google}
        >
          <span className="text-lg font-bold">G</span> Continue with Google
        </Button>
        <p className="muted text-center text-xs mt-7">
          {register ? "Already have an account?" : "New to StudioSpace?"}{" "}
          <Link
            className="text-primary"
            href={`${register ? "/login" : "/register"}?returnTo=${encodeURIComponent(returnTo)}`}
          >
            {register ? "Log in" : "Create an account"}
          </Link>
        </p>
      </section>
    </div>
  );
}
