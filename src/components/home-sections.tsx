import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/books";
export function HomeSections() {
  return (
    <>
      <section className="borrowing-section">
        <p className="eyebrow">Good stories. No complications.</p>
        <h2>Borrowing, simplified.</h2>
        <div className="steps-grid">
          {[
            ["01", "Discover", "Find a book that speaks to you."],
            ["02", "Borrow", "Make a little time for a new world."],
            ["03", "Return", "Close the chapter. Start another."],
          ].map(([n, title, copy]) => (
            <div key={n}>
              <span>
                {n} / {title}
              </span>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="category-section">
        <p className="eyebrow">Your reading mood</p>
        <h2>Find your next world.</h2>
        <div className="category-links">
          {categories.map((c) => (
            <Link key={c} href={`/books?category=${c}`}>
              {c}
              <ArrowUpRight size={14} />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
