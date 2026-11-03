import { AuthGuard } from "@/components/auth-guard";
import { Profile } from "@/components/profile";
export const metadata = { title: "My Profile" };
export default function Page() {
  return (
    <AuthGuard>
      <Profile />
    </AuthGuard>
  );
}
