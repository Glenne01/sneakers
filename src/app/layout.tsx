import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import Layout from '@/components/layout/Layout'

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: 'swap',
});

const inter = Inter({
  variable: "--font-inter", 
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SneakHouse - Sneakers Premium Adidas | Boutique Officielle",
  description: "Découvrez la collection exclusive de sneakers Adidas chez SneakHouse. Livraison gratuite dès 100€, retours 30 jours. Handball Spezial, Samba OG et plus encore.",
  keywords: "sneakers, adidas, chaussures, homme, femme, unisexe, handball spezial, samba og, livraison gratuite",
  authors: [{ name: "SneakHouse" }],
  creator: "SneakHouse",
  publisher: "SneakHouse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sneakhouse.fr'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SneakHouse - Sneakers Premium Adidas',
    description: 'La destination premium pour les sneakers Adidas. Collections exclusives, livraison gratuite dès 100€.',
    url: 'https://sneakhouse.fr',
    siteName: 'SneakHouse',
    images: [
      {
        url: 'https://i.imgur.com/tqc28SR.png',
        width: 1200,
        height: 630,
        alt: 'SneakHouse - Sneakers Premium',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SneakHouse - Sneakers Premium Adidas',
    description: 'La destination premium pour les sneakers Adidas. Collections exclusives.',
    creator: '@sneakhouse',
    images: ['https://i.imgur.com/tqc28SR.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="font-montserrat antialiased">
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
