import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy and studio terms" };

export default function PrivacyPage() {
  return (
    <div className="container py-16">
      <article className="mx-auto max-w-3xl space-y-6">
        <h1>Privacy and studio terms</h1>
        <p className="muted">
          StudioSpace is a student project for listing creative spaces and requesting reservations.
        </p>

        <section aria-labelledby="account-data">
          <h2 id="account-data" className="mb-3 text-2xl">Account and booking data</h2>
          <p>
            We store your name, email, account records, and session data to sign you in and
            connect listings and reservations to your account. Passwords are stored as hashes.
            If you use Google sign-in, Google shares your basic profile, email, and profile
            picture when available. Booking records include the studio, requested times, and
            reservation status. My Bookings shows the reservations tied to your account.
          </p>
        </section>

        <section aria-labelledby="public-listings">
          <h2 id="public-listings" className="mb-3 text-2xl">Public listings and uploaded photos</h2>
          <p>
            Studio listings publish the host’s name, photos, location, and listing details.
            The public catalog excludes the host’s account email. ImgBB stores photos uploaded
            through the listing form. Anyone with an image URL can view the photo, and deleting
            a listing does not automatically remove its hosted image.
          </p>
        </section>

        <section aria-labelledby="browser-storage">
          <h2 id="browser-storage" className="mb-3 text-2xl">Cookies and browser storage</h2>
          <p>
            StudioSpace uses cookies for sign-in and authenticated API requests. Your browser
            stores your theme preference and any email saved through the demo newsletter form.
            You can clear the saved preferences and newsletter email through your browser settings.
          </p>
        </section>

        <section id="terms" className="scroll-mt-24" aria-labelledby="studio-terms">
          <h2 id="studio-terms" className="mb-3 text-2xl">Studio and booking terms</h2>
          <p>
            List only spaces you have permission to offer and use photos you have permission
            to share. Keep listing details, capacity, pricing, and equipment information accurate.
            A booking request starts as pending. Check its status and confirm access, equipment,
            and any deposit arrangements with the host before making production plans.
          </p>
        </section>
      </article>
    </div>
  );
}
