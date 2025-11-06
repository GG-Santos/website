import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TRPCProvider } from "@/lib/trpc/Provider";
import { RootProvider } from "fumadocs-ui/provider/next";
import { ConsentManager } from "./consent-manager";
import { getSiteSettings } from "@/lib/site-settings-server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings();
    const metadata = settings.metadata || {
      title: "Juanito Bayani",
      description: "An Underdogs Studios Production",
    };

    return {
      title: metadata.title,
      description: metadata.description,
      // Icons are handled by icon.tsx and apple-icon.tsx route handlers
    };
  } catch (error) {
    // Fallback metadata if database is unavailable during static generation
    // This allows the not-found page to be statically generated
    return {
      title: "Juanito Bayani",
      description: "An Underdogs Studios Production",
    };
  }
}

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
