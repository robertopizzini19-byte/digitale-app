import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "digITAle — Lo Standard Digitale Italiano",
  description: "L'ecosistema digitale pensato per gli italiani, dagli italiani. Semplice, onesto, sovrano.",
  openGraph: {
    title: "digITAle — Lo Standard Digitale Italiano",
    description: "L'ecosistema digitale pensato per gli italiani, dagli italiani. Semplice, onesto, sovrano.",
    locale: "it_IT",
    type: "website",
    siteName: "digITAle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {/* Form nascosti per Netlify Forms — scansionati al build, non visibili all'utente */}
        <form name="waitlist" data-netlify="true" hidden aria-hidden="true">
          <input type="email" name="email" />
          <input type="text" name="piano" />
          <input type="text" name="ruolo" />
        </form>
        <form name="contatto" data-netlify="true" hidden aria-hidden="true">
          <input type="email" name="email" />
          <input type="text" name="messaggio" />
        </form>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
