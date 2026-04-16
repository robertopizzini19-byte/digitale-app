import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DigiITAle — Lo Standard Digitale Italiano",
  description:
    "L'ecosistema digitale pensato per gli italiani, dagli italiani. Semplice, onesto, sovrano.",
  openGraph: {
    title: "DigITAle — Lo Standard Digitale Italiano",
    description:
      "L'ecosistema digitale pensato per gli italiani, dagli italiani. Semplice, onesto, sovrano.",
    locale: "it_IT",
    type: "website",
    siteName: "DigITAle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
