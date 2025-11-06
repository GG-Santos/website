import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TRPCProvider } from "@/lib/trpc/Provider";
import { RootProvider } from "fumadocs-ui/provider/next";
import { ConsentManager } from "./consent-manager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Better Auth + tRPC + Prisma",
  description: "Next.js with Better Auth, tRPC, Prisma, and MongoDB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConsentManager>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            <TRPCProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <RootProvider>{children}</RootProvider>
              </Suspense>
            </TRPCProvider>
          </ThemeProvider>
        </ConsentManager>
      </body>
    </html>
  );
}
