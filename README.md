# StudioSpace

StudioSpace is a marketplace for discovering, hosting, and reserving creative workspaces by the hour.

- [Live StudioSpace site](https://studiospace-atik.vercel.app/)
- [Frontend repository](https://github.com/AtikHasanDev/Assignment-8)
- [Backend repository](https://github.com/AtikHasanDev/Assignment-8-server)
- [Live API](https://booknook-api-atik.vercel.app/api/studios?limit=6)

## Features

- Discover six recent studios on the homepage and filter the catalog by category.
- View studio photos, host information, amenities, rates, and capacity.
- Register with email and password or sign in with Google.
- Publish and edit listings, upload photos through ImgBB, and delete your own studios.
- Request a time slot, track your bookings, and cancel pending reservations.
- Receive an availability error when a requested slot overlaps a confirmed booking.
- Switch between light and dark themes. StudioSpace saves the preference in your browser.

## Tech stack

Next.js App Router, React, TypeScript, Tailwind CSS, Swiper, Sonner, and Lucide. Better Auth uses MongoDB and issues short-lived JWTs. Next.js sends a JWT to the Express API in a cookie for protected requests. MongoDB stores listings and reservations, and ImgBB hosts uploaded photos.

## Local setup

Use Node.js 22 or later with a version that supports the pinned pnpm release. Use MongoDB Atlas or a local replica set.

1. Clone this repository and the server repository into separate directories.
2. Run `pnpm install --frozen-lockfile` in each repository.
3. Copy the client’s `.env.example` to `.env.local` and the server’s `.env.example` to `.env`.
4. Configure MongoDB and the values below. Use the same `MONGODB_DB` in both projects.
5. Run `pnpm seed:studios` in the server repository to add six demo studios, then start the server with `pnpm dev`.
6. Run `pnpm dev` in this repository and open [localhost:3000](http://localhost:3000).

| Client variable | Local value or purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection URI |
| `MONGODB_DB` | Database name shared with the server |
| `BETTER_AUTH_URL` | `http://localhost:3000` |
| `BETTER_AUTH_SECRET` | A strong random secret |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` |
| `IMGBB_API_KEY` | ImgBB API key for image uploads |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |

For the server, set `CLIENT_ORIGIN` and `AUTH_ISSUER` to `http://localhost:3000`, `AUTH_AUDIENCE` to `booknook-api`, and `JWKS_URL` to `http://localhost:3000/api/auth/jwks`. The JWT audience must match the current Better Auth configuration.

## Examiner testing

Register an examiner account with an email you control and a password of at least six characters containing an uppercase and a lowercase letter. Then sign in with that email and password. If a dedicated examiner account has been provisioned, include its credentials in the submission notes.

1. Explore a category and open a studio. Request a future time slot, then check that it appears as Pending in My Bookings.
2. Cancel the request and verify the status changes to Cancelled.
3. Publish a studio with an HTTPS photo URL or an uploaded image, then edit and delete it from My Studio Listings.
4. Reload a private route while signed in and check that the page restores the session.

## Deployment

Deploy the Next.js client and Express server as separate projects. Set `BETTER_AUTH_URL`, `CLIENT_ORIGIN`, and `AUTH_ISSUER` to the deployed client origin. Set `NEXT_PUBLIC_API_URL` to the deployed API origin and `JWKS_URL` to the client’s `/api/auth/jwks` URL. The Google OAuth redirect URI is the client origin followed by `/api/auth/callback/google`.

Use `pnpm typecheck`, `pnpm lint`, and `pnpm build` to verify the client before deployment.
