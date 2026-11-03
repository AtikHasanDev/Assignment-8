import { AuthGuard } from "@/components/auth-guard";
import { BookDetails } from "@/components/book-details";
export const metadata = { title: "Book Details" };
export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AuthGuard>
      <BookDetails id={id} />
    </AuthGuard>
  );
}
