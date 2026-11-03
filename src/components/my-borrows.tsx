"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { api } from "@/lib/api";
import type { Borrow } from "@/lib/books";
import { Button, buttonVariants } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { BookCover } from "./book-card";
import { toast } from "sonner";
import "./catalogue.css";
const date = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
export function MyBorrows() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Borrow>();
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let current = true;
    api<Borrow[]>("/borrows", {}, true)
      .then((data) => {
        if (current) {
          setBorrows(data);
          setError("");
        }
      })
      .catch((e) => {
        if (current) setError(e.message);
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => {
      current = false;
    };
  }, [revision]);
  async function returnBook() {
    if (!selected) return;
    setBusy(true);
    try {
      await api(`/borrows/${selected._id}`, { method: "DELETE" }, true);
      setBorrows((old) => old.filter((b) => b._id !== selected._id));
      setSelected(undefined);
      toast.success("Book returned. Ready for your next chapter?");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not return this book.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container">
      <header className="page-heading">
        <p className="eyebrow">Currently on your nightstand</p>
        <h1>Your borrowed worlds.</h1>
        <p className="muted">
          Take your time. Keep an eye on your return dates.
        </p>
      </header>
      {loading ? (
        <p role="status" className="loading-panel">
          <LoaderCircle className="animate-spin" />
          Loading your borrows…
        </p>
      ) : error ? (
        <div className="empty-state">
          <p className="error-message mb-5" role="alert">
            {error}
          </p>
          <Button
            onClick={() => {
              setLoading(true);
              setRevision(revision + 1);
            }}
          >
            Try again
          </Button>
        </div>
      ) : !borrows.length ? (
        <div className="empty-state">
          <h2>Time for a new chapter.</h2>
          <p className="muted mb-6">Your borrowed books will appear here.</p>
          <Link href="/books" className={buttonVariants()}>
            Explore the collection
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto panel !p-0">
          <table className="w-full text-left text-sm min-w-[620px]">
            <caption className="sr-only">Your active book loans</caption>
            <thead className="text-xs muted border-b border-slate-700">
              <tr>
                <th className="p-5">Book</th>
                <th className="p-5">Borrowed</th>
                <th className="p-5">Return by</th>
                <th className="p-5">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((b) => (
                <tr
                  key={b._id}
                  className="border-b border-slate-700 last:border-0"
                >
                  <td className="p-5">
                    <Link
                      href={`/books/${b.bookId}`}
                      className="flex items-center gap-4"
                    >
                      <BookCover
                        src={b.bookImage}
                        title={b.bookTitle}
                        className="!w-12"
                      />
                      <span className="font-serif text-lg">{b.bookTitle}</span>
                    </Link>
                  </td>
                  <td className="p-5 muted">{date(b.borrowDate)}</td>
                  <td className="p-5 text-primary">{date(b.returnDate)}</td>
                  <td className="p-5">
                    <Button variant="outline" onClick={() => setSelected(b)}>
                      Return book
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open && !busy) setSelected(undefined);
        }}
        title="Close this chapter?"
        description={`Return “${selected?.bookTitle}” and make it available to another reader.`}
      >
        <Button disabled={busy} onClick={returnBook}>
          {busy ? "Returning…" : "Confirm return"}
        </Button>
      </Dialog>
    </div>
  );
}
