import type { Metadata } from "next";
import { Inter, Fraunces, Figtree } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bloom — Mental Health, Reimagined",
  description:
    "Bloom is your personal mental wellness companion. Track your mood, journal your thoughts, talk to an AI therapist, and connect with people who understand.",
  keywords: ["mental health", "mood tracker", "AI therapist", "wellness", "journal", "anxiety", "self care"],
  openGraph: {
    title: "Bloom — Mental Health, Reimagined",
    description: "Track your mood, journal your thoughts, talk to Aastha AI, and connect with people who understand.",
    siteName: "Bloom",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} ${figtree.variable} antialiased font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
