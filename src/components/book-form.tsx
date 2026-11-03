"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload, ArrowUpRight } from "lucide-react";
import { categories, type Book } from "@/lib/books";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { toast } from "sonner";
export function BookForm({
  book,
  onSaved,
}: {
  book?: Book;
  onSaved?: () => void;
}) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      let image = book?.image;
      const file = form.get("image");
      if (file instanceof File && file.size) {
        if (file.size > 5 * 1024 * 1024)
          throw new Error("Choose an image smaller than 5 MB.");
        const upload = new FormData();
        upload.set("image", file);
        const response = await fetch("/api/upload", {
          method: "POST",
          body: upload,
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Image upload failed.");
        image = result.url;
      }
      if (!image) throw new Error("Please upload a book cover.");
      const body = {
        title: String(form.get("title")).trim(),
        author: String(form.get("author")).trim(),
        category: String(form.get("category")),
        description: String(form.get("description")).trim(),
        image,
        totalCopies: Number(form.get("totalCopies")),
      };
      await api(
        book ? `/books/${book._id}` : "/books",
        { method: book ? "PATCH" : "POST", body: JSON.stringify(body) },
        true,
      );
      toast.success(
        book ? "Your book has been updated." : "A new story is on the shelf.",
      );
      if (onSaved) onSaved();
      else router.push("/my-books");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "The book could not be saved.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="form-grid">
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="field">
          Book title
          <input
            name="title"
            required
            maxLength={160}
            defaultValue={book?.title}
            placeholder="A story worth sharing"
          />
        </label>
        <label className="field">
          Author name
          <input
            name="author"
            required
            maxLength={120}
            defaultValue={book?.author}
            placeholder="Who wrote it?"
          />
        </label>
        <label className="field">
          Category
          <select name="category" defaultValue={book?.category || "Fiction"}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Total copies
          <input
            name="totalCopies"
            type="number"
            min={1}
            max={10000}
            step={1}
            required
            defaultValue={book?.totalCopies || 1}
          />
        </label>
      </div>
      <label className="field">
        <span className="flex items-center gap-2">
          <Upload size={15} />
          Book cover {book && "(optional replacement)"}
        </span>
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={!book}
        />
        <span className="muted text-xs">JPG, PNG, or WebP · Maximum 5 MB</span>
      </label>
      <label className="field">
        Short description
        <textarea
          name="description"
          required
          minLength={10}
          maxLength={4000}
          defaultValue={book?.description}
          placeholder="What makes this book a good read?"
        />
      </label>
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="field">
          Your name
          <input value={session?.user.name || ""} readOnly />
        </label>
        <label className="field">
          Your email
          <input value={session?.user.email || ""} readOnly />
        </label>
      </div>
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
      <Button className="justify-self-start" disabled={busy}>
        {busy ? "Saving your book…" : book ? "Save changes" : "Add book"}
        <ArrowUpRight size={16} />
      </Button>
    </form>
  );
}
