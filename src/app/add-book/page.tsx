import { AuthGuard } from "@/components/auth-guard";
import { BookForm } from "@/components/book-form";
export const metadata = { title: "Add Book" };
export default function AddBookPage() {
  return (
    <AuthGuard>
      <div className="container max-w-4xl">
        <header className="page-heading">
          <p className="eyebrow">Share a little wonder</p>
          <h1>Add a story to the shelf.</h1>
          <p className="muted">
            Your favourite book could be someone’s next great discovery.
          </p>
        </header>
        <section className="panel">
          <BookForm />
        </section>
      </div>
    </AuthGuard>
  );
}
