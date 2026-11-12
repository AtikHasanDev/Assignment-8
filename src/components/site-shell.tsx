"use client";

import { Aperture, LogOut, Menu, Moon, Sun, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { toast, Toaster } from "sonner";
import { authClient } from "@/lib/auth-client";
import { studioCategories } from "@/lib/studios";
import { getServerTheme, getTheme, setTheme, subscribeToTheme } from "@/lib/theme";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore studios" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#about", label: "About us" },
];

const accountLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/add-studio", label: "Add new studio" },
  { href: "/my-listings", label: "My studio listings" },
  { href: "/my-bookings", label: "My bookings" },
];

export function Logo() {
  return (
    <Link href="/" className="logo">
      <span><Aperture size={19} aria-hidden="true" /></span>
      StudioSpace
    </Link>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const accountMenu = useRef<HTMLDetailsElement>(null);
  const { data: session, isPending } = authClient.useSession();

  function closeAccount() {
    if (accountMenu.current) accountMenu.current.open = false;
  }

  async function logout() {
    try {
      const { error } = await authClient.signOut();
      if (error) throw new Error(error.message || "Could not log out.");
      closeAccount();
      toast.success("You’ve been logged out.");
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not log out.");
    }
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="site-header">
        <div className="container nav-inner">
          <Logo />
          <nav id="site-nav" aria-label="Main navigation" className={`main-nav ${menu ? "is-open" : ""}`}>
            {mainLinks.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenu(false)}
                aria-current={pathname === href || (href === "/studios" && pathname.startsWith("/studios/")) ? "page" : undefined}>
                {label}
              </Link>
            ))}
            {!isPending && !session && <Link href="/register" className="mobile-register" onClick={() => setMenu(false)}>Register</Link>}
          </nav>
          <div className="nav-actions">
            <button type="button" className="icon-button theme-toggle"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>
            {!isPending && (session ? (
              <details ref={accountMenu} className="account-details"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) closeAccount();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    closeAccount();
                    event.currentTarget.querySelector("summary")?.focus();
                  }
                }}>
                <summary className="avatar" aria-label={`Account for ${session.user.name}`}>
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="" referrerPolicy="no-referrer" />
                  ) : <UserRound size={19} aria-hidden="true" />}
                </summary>
                <div className="account-menu">
                  <p className="account-name">{session.user.name}</p>
                  {accountLinks.map(({ href, label }) => (
                    <Link key={href} href={href} onClick={closeAccount} aria-current={pathname === href ? "page" : undefined}>{label}</Link>
                  ))}
                  <button type="button" onClick={() => void logout()}>
                    <LogOut size={16} aria-hidden="true" /> Log out
                  </button>
                </div>
              </details>
            ) : (
              <>
                <Link href="/login">Log in</Link>
                <Link href="/register" className="button button-primary">Register</Link>
              </>
            ))}
            <button type="button" className="icon-button mobile-toggle" aria-controls="site-nav"
              aria-expanded={menu} aria-label={menu ? "Close navigation" : "Open navigation"}
              onClick={() => setMenu((open) => !open)}>
              {menu ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <SiteFooter />
      <Toaster richColors theme={theme} position="bottom-right" closeButton />
    </>
  );
}

function SiteFooter() {
  function saveNewsletterEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    try {
      localStorage.setItem("studiospace-newsletter-email", email);
      toast.success("Email saved on this device.");
      form.reset();
    } catch {
      toast.error("Could not save your email on this device.");
    }
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Logo />
            <p className="muted mt-3 max-w-72">Find creative spaces and share your studio with the people who need it.</p>
          </div>
          <div>
            <h2 className="footer-title">Explore</h2>
            <ul className="footer-links">
              {mainLinks.map(({ href, label }) => <li key={href}><Link href={href}>{label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2 className="footer-title">Studio categories</h2>
            <ul className="footer-links">
              {studioCategories.map((category) => (
                <li key={category}><Link href={`/studios?category=${encodeURIComponent(category)}`}>{category}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="footer-title">Newsletter</h2>
            <form className="footer-newsletter" onSubmit={saveNewsletterEmail}>
              <label className="field">
                Email address
                <input name="email" type="email" required autoComplete="email" />
              </label>
              <p className="muted">This demo saves your email on this device.</p>
              <button type="submit" className="button button-outline">Save email</button>
            </form>
            <a className="icon-button mt-4" href="https://x.com/intent/post?text=Discover%20creative%20spaces%20with%20StudioSpace"
              aria-label="Share StudioSpace on X">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-7.4L5.5 22H2.4l7.3-8.4L2 2h6.5l4.4 6.7L18.9 2Zm-1.1 18h1.7L7.6 3.9H5.8L17.8 20Z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} StudioSpace. All rights reserved.</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/privacy#terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
