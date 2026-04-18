import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const APP_URL = "https://digitale-italia.netlify.app";
const TITLE = "digITAle — Fatturazione e Gestione Digitale per Italiani";
const DESCRIPTION =
  "Fatture elettroniche, scadenze fiscali, contratti e documenti — tutto in italiano, tutto sotto il tuo controllo. Gratis per iniziare.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: TITLE,
    template: "%s | digITAle",
  },
  description: DESCRIPTION,
  keywords: [
    "fatturazione elettronica",
    "gestione fatture",
    "freelance Italia",
    "partita IVA",
    "scadenze fiscali",
    "dichiarazione redditi",
    "PMI digitale",
    "software fatturazione gratuito",
  ],
  authors: [{ name: "digITAle" }],
  creator: "digITAle",
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: APP_URL,
    siteName: "digITAle",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "digITAle — Lo Standard Digitale Italiano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${inter.variable} h-full`}>
      <head>
        <Script
          id="ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "digITAle",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
              description: DESCRIPTION,
              url: APP_URL,
              inLanguage: "it",
            }),
          }}
        />
      </head>
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
