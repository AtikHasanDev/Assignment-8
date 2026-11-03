"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, LoaderCircle, Search } from "lucide-react";
import { api, apiConfigured } from "@/lib/api";
import { categories, previewBooks, type Book } from "@/lib/books";
import { BookCard } from "./book-card";
import { Button, buttonVariants } from "./ui/button";
import "./catalogue.css";
export function Catalogue({ latest = false }: { latest?: boolean }) {
  const params = useSearchParams();
  const [books, setBooks] = useState<Book[]>(apiConfigured ? [] : previewBooks);
  const [loading, setLoading] = useState(apiConfigured);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(params.get("category") || "");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!apiConfigured) return;
    const controller = new AbortController();
    api<Book[]>(`/books${latest ? "?sort=newest&limit=6" : ""}`, {
      signal: controller.signal,
    })
      .then(setBooks)
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [latest, retry]);
  const filtered = books.filter(
    (b) =>
      (!category || b.category === category) &&
      `${b.title} ${b.author}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      {latest && (
        <div className="section-heading">
          <div>
            <p className="eyebrow">Curated for curious minds</p>
            <h2>Start with a good story.</h2>
            <p className="muted">
              The newest titles in our ever-growing collection.
            </p>
          </div>
          <Link href="/books" className={buttonVariants()}>
            View the catalogue <ArrowUpRight size={15} />
          </Link>
        </div>
      )}
      {!apiConfigured && (
        <p className="preview-notice" role="status">
          Design preview · These sample titles show the approved layout. The
          live library will appear once connected.
        </p>
      )}
      {!latest && (
        <form
          className="catalogue-search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="search-field">
            <Search size={18} />
            <span className="sr-only">Search books</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search titles, authors…"
            />
          </label>
          <label>
            <span className="sr-only">Category</span>
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <Button type="submit">
            Find a story <ArrowUpRight size={16} />
          </Button>
        </form>
      )}
      {!latest && (
        <div className="catalogue-count">
          <span>
            {loading
              ? "Loading collection…"
              : `Showing ${filtered.length} ${filtered.length === 1 ? "book" : "books"}`}
          </span>
          <span>Latest first · Open a new chapter</span>
        </div>
      )}
      {loading ? (
        <div role="status" className="loading-panel">
          <LoaderCircle className="animate-spin" />
          Finding your next read…
        </div>
      ) : error ? (
        <div className="empty-state">
          <h2>The shelves are taking a moment.</h2>
          <p className="muted mb-6">{error}</p>
          <Button
            onClick={() => {
              setError("");
              setLoading(true);
              setRetry(retry + 1);
            }}
          >
            Try again
          </Button>
        </div>
      ) : filtered.length ? (
        <div className={`book-grid ${latest ? "arrival-grid" : ""}`}>
          {filtered.map((book) => (
            <BookCard key={book._id} book={book} compact={latest} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No books here just yet.</h2>
          <p className="muted">
            Try another search, or be the first to add a story.
          </p>
        </div>
      )}
      {latest && (
        <div className="mt-8 text-center">
          <Link
            href="/books"
            className={buttonVariants({ variant: "outline" })}
          >
            See all books <ArrowUpRight size={15} />
          </Link>
        </div>
      )}
    </>
  );
}
