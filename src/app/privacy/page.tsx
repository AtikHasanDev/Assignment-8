import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <p className="eyebrow">BookNook</p>
        <h1 className="text-4xl">Privacy and your data</h1>
        <p className="muted">
          Updated 2 November 2026. BookNook is a student library project
          operated by Mahmudul Hassan.
        </p>
        <h2 className="text-2xl">What the library stores</h2>
        <p>
          BookNook stores your name, email address, account and session records,
          books you add, and borrowing records. Email accounts use a password
          hash. Google sign-in supplies your basic profile, email, and profile
          picture when available; BookNook does not request access to your Gmail
          messages, contacts, or Drive files.
        </p>
        <h2 className="text-2xl">How this information is used</h2>
        <p>
          Account information signs you in and associates books and loans with
          your account. Session cookies keep you signed in. Your book listings
          and cover images are public. Your borrowing shelf is available through
          authenticated access to your own account.
        </p>
        <h2 className="text-2xl">Services used</h2>
        <p>
          Vercel hosts the application and API, MongoDB Atlas stores application
          records, Google provides optional sign-in, and imgbb hosts uploaded
          covers. Covers uploaded to imgbb can be accessed by anyone with their
          image URL. Please do not upload private or sensitive images.
        </p>
        <h2 className="text-2xl">Your choices</h2>
        <p>
          You can use email sign-in instead of Google, sign out, and manage
          books you own. To request account or data removal, contact{" "}
          <a className="underline" href="mailto:mh4846111@gmail.com">
            mh4846111@gmail.com
          </a>
          . Removing a book listing does not automatically remove its image from
          imgbb. You can also revoke BookNook access in your Google Account
          settings.
        </p>
      </div>
    </section>
  );
}
