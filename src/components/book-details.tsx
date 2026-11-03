"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Book } from "@/lib/books";
import { BookCover } from "./book-card";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import "./catalogue.css";
export function BookDetails({ id }: { id: string }) {
  const [book, setBook] = useState<Book>();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const { data: session } = authClient.useSession();
  useEffect(() => {
    let current = true;
    api<Book>(`/books/${id}`, {}, true)
      .then((b) => {
        if (current) setBook(b);
      })
      .catch((e) => {
        if (current) setError(e.message);
      });
    return () => {
      current = false;
    };
  }, [id]);
  async function borrow() {
    setBusy(true);
    try {
      await api(
        "/borrows",
        { method: "POST", body: JSON.stringify({ bookId: id }) },
        true,
      );
      setBook((b) => b && { ...b, availableCopies: b.availableCopies - 1 });
      setOpen(false);
      toast.success("The book is yours for 14 days. Happy reading!");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not borrow the book.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (error)
    return (
      <div className="container section empty-state">
        <h1 className="text-4xl mb-5">This story is out of reach.</h1>
        <p className="muted">{error}</p>
        <Link className="button button-primary mt-6" href="/books">
          Back to all books
        </Link>
      </div>
    );
  if (!book)
    return (
      <p role="status" className="container section">
        Loading book…
      </p>
    );
  return (
    <div className="container section">
      <Link href="/books" className="muted text-xs">
        ← Back to the collection
      </Link>
      <div className="grid md:grid-cols-2 gap-10 lg:gap-20 mt-9">
        <div className="book-art min-h-96">
          <BookCover src={book.image} title={book.title} className="!w-52" />
        </div>
        <div>
          <p className="eyebrow">{book.category}</p>
          <h1 className="mb-5">{book.title}</h1>
          <p className="muted">By {book.author}</p>
          <p className="my-8 whitespace-pre-wrap">{book.description}</p>
          <p className="muted text-sm">Added by {book.ownerName}</p>
          <p className="text-primary text-sm mt-3 mb-7">
            {book.availableCopies > 0
              ? `${book.availableCopies} of ${book.totalCopies} copies available`
              : "Not available"}
          </p>
          <Button
            disabled={book.availableCopies < 1}
            onClick={() => setOpen(true)}
          >
            {book.availableCopies ? "Borrow this book" : "Not available"}
          </Button>
          <p className="muted text-xs mt-4">
            Yours for 14 days. Return it when you’re ready.
          </p>
        </div>
      </div>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!busy) setOpen(value);
        }}
        title="Make it your next read."
        description={`Borrow ${book.title} for 14 days. Your return date will be recorded when you confirm.`}
      >
        <div className="form-grid">
          <label className="field">
            Your name
            <input readOnly value={session?.user.name || ""} />
          </label>
          <label className="field">
            Your email
            <input readOnly value={session?.user.email || ""} />
          </label>
          <Button disabled={busy} onClick={borrow}>
            {busy ? "Confirming…" : "Confirm borrow"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
