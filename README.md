# BookNook — Assignment-8

A community library web app for discovering books, sharing your collection, and managing borrowing in one place.

**Live site:** https://booknook-atik.vercel.app  
**API:** https://booknook-api-atik.vercel.app  
**Backend repository:** https://github.com/AtikHasanDev/Assignment-8-server

## Features

- Browse the catalogue and the six newest additions on the homepage.
- Search by title or author and filter by Fiction, Science, History, Kids, or Others.
- Register and sign in with email/password or Google through Better Auth.
- View protected book details and borrow available copies for 14 days.
- Track and return your borrowed books.
- Add books with cover uploads, and edit or delete books you own.
- Keep copy availability consistent through the backend's MongoDB transactions.
- Responsive navigation, account pages, loading states, and error feedback.

## Technology

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Better Auth, MongoDB, Radix UI, Lucide, Sonner, Swiper, and ImgBB. The separate API uses Express and verifies Better Auth JWTs.

## Local setup

Use Node.js 22 or newer and pnpm (the project pins pnpm 11.25.0). Use a Node release supported by the pinned package manager. MongoDB must support transactions: use Atlas or a local replica set.

```sh
git clone https://github.com/AtikHasanDev/Assignment-8.git
cd Assignment-8
pnpm install
```

Copy `.env.example` to `.env.local`, then configure:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string used by authentication |
| `MONGODB_DB` | Database name; use the same value in the API project |
| `BETTER_AUTH_URL` | Website origin, locally `http://localhost:3000` |
| `BETTER_AUTH_SECRET` | Strong random secret for authentication |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID; optional for email/password sign-in |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_API_URL` | API origin, locally `http://localhost:4000` |
| `IMGBB_API_KEY` | Server-side ImgBB key for cover uploads |

Start the backend using its README, then run:

```sh
pnpm dev
```

Open http://localhost:3000. The backend repository can be cloned separately; it does not need to be nested inside this project.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Build for production |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Generate Next.js types and check TypeScript |

## Project structure

```text
src/app/          Pages, layouts, styles, and authentication/upload routes
src/components/  Catalogue, book forms, account views, and UI components
src/lib/         API client, authentication setup, and shared types
public/          Static assets
```

Better Auth runs in this Next.js project at `/api/auth/*`. The browser obtains a short-lived JWT and sends it as a bearer token to the separate Express API. Database and provider secrets stay on the server; only `NEXT_PUBLIC_API_URL` is intended for the browser.

## Deploying on Vercel

Deploy this repository as a Next.js project and the backend as a separate Express project. Configure the environment variables above in Vercel before building.

For the current production deployment:

```text
BETTER_AUTH_URL=https://booknook-atik.vercel.app
NEXT_PUBLIC_API_URL=https://booknook-api-atik.vercel.app
```

Set the backend's `CLIENT_ORIGIN` and `AUTH_ISSUER` to the website origin, and `JWKS_URL` to `https://booknook-atik.vercel.app/api/auth/jwks`. Make sure the database permits connections from the deployment environment. Redeploy after changing environment variables, especially the browser-visible API URL.

In the Google OAuth web client, authorize these origins and redirect URLs:

| Environment | JavaScript origin | Redirect URI |
| --- | --- | --- |
| Local | `http://localhost:3000` | `http://localhost:3000/api/auth/callback/google` |
| Production | `https://booknook-atik.vercel.app` | `https://booknook-atik.vercel.app/api/auth/callback/google` |

The redirect URI must match exactly. A responding authentication endpoint does not by itself verify a complete Google login; test the sign-in flow after Google applies configuration changes.

## Catalogue data

Live catalogue data comes from the API. Run the backend's `pnpm seed` command to add eight starter books. The frontend only uses design-preview titles when the API URL is not configured.

## Troubleshooting

- **No books:** check the API URL and `/books` response; seed an empty database from the backend project.
- **Cannot reach the library:** start both services and check that `CLIENT_ORIGIN` matches the website origin.
- **Google `redirect_uri_mismatch`:** check the exact redirect URI on the OAuth client used by the deployed credentials.
- **Borrow or update fails:** check MongoDB replica-set support and API authentication settings.

Never commit `.env.local`, database credentials, or provider secrets.
