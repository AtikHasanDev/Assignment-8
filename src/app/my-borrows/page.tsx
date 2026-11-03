import { AuthGuard } from "@/components/auth-guard";
import { MyBorrows } from "@/components/my-borrows";
export const metadata = { title: "My Borrows" };
export default function Page() {
  return (
    <AuthGuard>
      <MyBorrows />
    </AuthGuard>
  );
}
