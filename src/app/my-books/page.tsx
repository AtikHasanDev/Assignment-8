import { AuthGuard } from "@/components/auth-guard";
import { MyBooks } from "@/components/my-books";
export const metadata = { title: "My Books" };
export default function Page() {
  return (
    <AuthGuard>
      <MyBooks />
    </AuthGuard>
  );
}
