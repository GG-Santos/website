"use client";

import { createAuthClient } from "better-auth/react";

// Get the base URL for Better Auth
// In production on Vercel, use the current origin (window.location.origin)
// This ensures it works even if NEXT_PUBLIC_BETTER_AUTH_URL is not set
function getBaseURL(): string {
  // Client-side: use current origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Server-side: use environment variable or fallback
  return (
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  );
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signUp, signOut, useSession } = authClient;

