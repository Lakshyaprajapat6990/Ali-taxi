import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 390,
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "AliTaxis Norwich - Airport Transfers & Long Distance Taxi",
  description: "Reliable taxi service in Norwich. Airport transfers to Heathrow, Gatwick, Stansted & Luton. Fixed prices, 24/7 available, licensed & insured.",
  keywords: ["AliTaxis", "Norwich taxi", "airport transfer", "Heathrow taxi", "Gatwick taxi", "Stansted taxi", "Luton taxi", "long distance taxi"],
  authors: [{ name: "AliTaxis Norwich" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "AliTaxis Norwich - Airport Transfers & Long Distance Taxi",
    description: "Reliable taxi service in Norwich. Fixed prices, 24/7 available.",
    siteName: "AliTaxis Norwich",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AliTaxis Norwich - Airport Transfers & Long Distance Taxi",
    description: "Reliable taxi service in Norwich. Fixed prices, 24/7 available.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
