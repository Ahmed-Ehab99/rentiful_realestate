import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rentiful.com",
  ),
  title: {
    default: "Rentiful | Find Your Perfect Rental Home",
    template: "%s | Rentiful",
  },
  description:
    "Discover thousands of rental properties, apartments, houses, and condos. Rentiful makes finding your next home easy with verified listings, virtual tours, and seamless applications.",
  keywords: [
    "rental properties",
    "apartments for rent",
    "houses for rent",
    "condos for rent",
    "property rental",
    "find rentals",
    "rental listings",
    "apartment search",
    "rent home",
    "rental marketplace",
    "real estate rentals",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rentiful.com",
    siteName: "Rentiful",
    title: "Rentiful | Find Your Perfect Rental Home",
    description:
      "Discover thousands of rental properties, apartments, houses, and condos. Rentiful makes finding your next home easy with verified listings, virtual tours, and seamless applications.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Rentiful - Find Your Perfect Rental Home",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
      </head>
      <body className="bg-background text-foreground min-h-screen antialiased">
        {children}
        <Toaster closeButton />
      </body>
    </html>
  );
}
