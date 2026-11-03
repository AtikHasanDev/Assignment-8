"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, LoaderCircle } from "lucide-react";
import { api } from "@/lib/api";
import type { Book } from "@/lib/books";
import { Button, buttonVariants } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { BookForm } from "./book-form";
import { BookCover } from "./book-card";
import { toast } from "sonner";
import "./catalogue.css";
export function MyBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Book>();
  const [deleting, setDeleting] = useState<Book>();
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let current = true;
    api<Book[]>("/books?mine=true", {}, true)
      .then((data) => {
        if (current) {
          setBooks(data);
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
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    try {
      await api(`/books/${deleting._id}`, { method: "DELETE" }, true);
      setBooks((old) => old.filter((b) => b._id !== deleting._id));
      setDeleting(undefined);
      toast.success("Book removed from the shelf.");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not delete the book.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container">
      <header className="page-heading section-heading">
        <div>
          <p className="eyebrow">Your contributions</p>
          <h1>Stories you’ve shared.</h1>
          <p className="muted">A small shelf. A lasting impression.</p>
        </div>
        <Link href="/add-book" className={buttonVariants()}>
          <Plus size={16} />
          Add a book
        </Link>
      </header>
      {loading ? (
        <p role="status" className="loading-panel">
          <LoaderCircle className="animate-spin" />
          Loading your shelf…
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
      ) : books.length === 0 ? (
        <div className="empty-state">
          <h2>Your shelf is waiting.</h2>
          <p className="muted mb-6">
            Add your first book and share a story with the community.
          </p>
          <Link href="/add-book" className={buttonVariants()}>
            Add your first book
          </Link>
        </div>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <article key={book._id} className="book-card">
              <Link href={`/books/${book._id}`} className="book-art">
                <BookCover src={book.image} title={book.title} />
              </Link>
              <div className="book-card-body">
                <p className="book-category">{book.category}</p>
                <h3>{book.title}</h3>
                <p className="book-author">
                  {book.author} · {book.availableCopies}/{book.totalCopies}{" "}
                  available
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <Button
                    variant="outline"
                    onClick={() => setEditing(book)}
                    aria-label={`Edit ${book.title}`}
                  >
                    <Pencil size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setDeleting(book)}
                    aria-label={`Delete ${book.title}`}
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(undefined);
        }}
        title="Edit your book."
        description="Update the story’s details, cover, or total copies."
      >
        {editing && (
          <BookForm
            key={editing._id}
            book={editing}
            onSaved={() => {
              setEditing(undefined);
              setLoading(true);
              setRevision(revision + 1);
            }}
          />
        )}
      </Dialog>
      <Dialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open && !busy) setDeleting(undefined);
        }}
        title="Remove this story?"
        description={`Delete “${deleting?.title}” from the library? Books with active borrows must be returned first.`}
      >
        <div className="flex gap-3">
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => setDeleting(undefined)}
          >
            Keep book
          </Button>
          <Button variant="destructive" disabled={busy} onClick={remove}>
            {busy ? "Deleting…" : "Delete book"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
