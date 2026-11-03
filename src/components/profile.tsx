/* eslint-disable @next/next/no-img-element */
"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
export function Profile() {
  const { data } = authClient.useSession();
  return (
    <div className="container max-w-3xl">
      <header className="page-heading">
        <p className="eyebrow">Your reading identity</p>
        <h1>My profile.</h1>
      </header>
      <div className="panel">
        <div className="flex gap-5 items-center mb-8">
          <div className="avatar !w-16 !h-16 flex items-center justify-center text-xl">
            {data?.user.image ? (
              <img src={data.user.image} alt={data.user.name} />
            ) : (
              data?.user.name.slice(0, 1)
            )}
          </div>
          <div>
            <h2 className="text-3xl">{data?.user.name}</h2>
            <p className="muted mt-2">{data?.user.email}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/my-books" className={buttonVariants()}>
            My books
          </Link>
          <Link
            href="/my-borrows"
            className={buttonVariants({ variant: "outline" })}
          >
            My borrows
          </Link>
        </div>
      </div>
    </div>
  );
}
