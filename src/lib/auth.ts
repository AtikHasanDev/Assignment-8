import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
let instance: ReturnType<typeof makeAuth> | undefined;
function makeAuth() {
  if (
    !process.env.MONGODB_URI ||
    !process.env.BETTER_AUTH_SECRET ||
    !process.env.BETTER_AUTH_URL
  )
    throw new Error("Authentication is not configured.");
  const client = new MongoClient(process.env.MONGODB_URI);
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: mongodbAdapter(client.db(process.env.MONGODB_DB || "booknook"), {
      client,
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      autoSignIn: false,
      requireEmailVerification: false,
    },
    socialProviders:
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {},
    plugins: [
      jwt({
        jwt: {
          issuer: process.env.BETTER_AUTH_URL,
          audience: "booknook-api",
          expirationTime: "5m",
          definePayload: ({ user }) => ({ email: user.email, name: user.name }),
        },
      }),
    ],
  });
}
export function getAuth() {
  return (instance ??= makeAuth());
}
