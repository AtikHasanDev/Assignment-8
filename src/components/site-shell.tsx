/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import {
  BookOpen,
  Menu,
  X,
  LogOut,
  UserRound,
  ArrowUpRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast, Toaster } from "sonner";
import { buttonVariants } from "./ui/button";
export function Logo() {
  return (
    <Link href="/" className="logo">
      <span>
        <BookOpen size={19} strokeWidth={2.5} />
      </span>
      BookNook
    </Link>
  );
}
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const links = [
    { href: "/", label: "Home" },
    { href: "/books", label: "All Books" },
    ...(session
      ? [
          { href: "/add-book", label: "Add Book" },
          { href: "/my-books", label: "My Books" },
          { href: "/my-borrows", label: "My Borrows" },
        ]
      : []),
  ];
  async function logout() {
    const { error } = await authClient.signOut();
    if (error) toast.error(error.message || "Could not log out.");
    else {
      toast.success("You’ve been logged out.");
      router.push("/");
    }
  }
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container nav-inner">
          <Logo />
          <nav
            aria-label="Main navigation"
            className={`main-nav ${menu ? "is-open" : ""}`}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenu(false)}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            {!isPending && !session && (
              <Link
                href="/register"
                className="mobile-register"
                onClick={() => setMenu(false)}
              >
                Register
              </Link>
            )}
          </nav>
          <div className="nav-actions">
            {!isPending &&
              (session ? (
                <Dropdown.Root>
                  <Dropdown.Trigger
                    className="avatar"
                    aria-label="Open account menu"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      session.user.name.slice(0, 1).toUpperCase()
                    )}
                  </Dropdown.Trigger>
                  <Dropdown.Portal>
                    <Dropdown.Content
                      className="account-menu"
                      sideOffset={12}
                      align="end"
                    >
                      <Dropdown.Label className="account-name">
                        {session.user.name}
                      </Dropdown.Label>
                      <Dropdown.Item asChild>
                        <Link href="/my-profile">
                          <UserRound size={16} />
                          My Profile
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item onSelect={logout}>
                        <LogOut size={16} />
                        Log out
                      </Dropdown.Item>
                    </Dropdown.Content>
                  </Dropdown.Portal>
                </Dropdown.Root>
              ) : (
                <>
                  <Link className="login-link" href="/login">
                    Log in
                  </Link>
                  <Link className={buttonVariants()} href="/register">
                    Get started <ArrowUpRight size={14} />
                  </Link>
                </>
              ))}
            <button
              className="icon-button mobile-toggle"
              aria-label={menu ? "Close navigation" : "Open navigation"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <Logo />
              <p className="muted mt-5 max-w-72">
                A little library for big imaginations.
                <br />
                Discover a story. Share a world.
              </p>
            </div>
            <div>
              <p className="eyebrow">Explore</p>
              <div className="footer-links">
                <Link href="/">Home</Link>
                <Link href="/books">All Books</Link>
                <Link href="/register">Join the library</Link>
              </div>
            </div>
            <div>
              <p className="eyebrow">Say hello</p>
              <a href="mailto:mh4846111@gmail.com">mh4846111@gmail.com</a>
              <div className="footer-links mt-4">
                <a
                  href="https://github.com/MH-git-ui"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub (opens in a new tab)"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://github.com/MH-git-ui/Assignment-8"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Source code (opens in a new tab)"
                >
                  Source code ↗
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} BookNook. All rights reserved.
            </span>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
      <Toaster richColors theme="dark" position="bottom-right" closeButton />
    </>
  );
}
