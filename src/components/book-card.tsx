import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Book } from "@/lib/books";
export function BookCover({
  src,
  title,
  className = "",
}: {
  src: string;
  title: string;
  className?: string;
}) {
  /* eslint-disable @next/next/no-img-element */
  return (
    <img
      className={`book-cover ${className}`}
      src={src}
      alt={`${title} book cover`}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = "/covers/fallback.svg";
      }}
    />
  );
}
export function BookCard({
  book,
  compact = false,
}: {
  book: Book;
  compact?: boolean;
}) {
  return (
    <article className={`book-card ${compact ? "book-card-compact" : ""}`}>
      <Link
        href={`/books/${book._id}`}
        className="book-art"
        aria-label={`View ${book.title}`}
      >
        <BookCover src={book.image} title={book.title} />
      </Link>
      <div className="book-card-body">
        <p className="book-category">{book.category}</p>
        <h3>
          <Link href={`/books/${book._id}`}>{book.title}</Link>
        </h3>
        <p className="book-author">By {book.author}</p>
        <Link href={`/books/${book._id}`} className="book-detail-link">
          View details <ArrowUpRight size={13} />
        </Link>
      </div>
    </article>
  );
}
