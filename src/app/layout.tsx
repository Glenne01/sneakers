import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import { AuthProvider } from "@/components/auth/AuthProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "SneakHouse - Boutique Premium de Sneakers Adidas",
  description: "Découvrez les dernières collections de sneakers Adidas chez SneakHouse. Livraison rapide, retours gratuits.",
  keywords: "sneakers, adidas, chaussures sport, basket, SneakHouse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={montserrat.variable}>
        <AuthProvider>
          <Layout>
            {children}
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
