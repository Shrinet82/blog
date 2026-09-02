import type { Metadata } from "next";
import { Inter, Source_Serif_4, Noto_Serif_Devanagari } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
});

const notoDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-devanagari",
});

export const metadata: Metadata = {
  title: "ABHISHAL — विधि शोध पत्रिका",
  description:
    "Scholarly discipline for legal excellence. Analysis of daily current affairs, landmark precedents, and constitutional law.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${inter.variable} ${sourceSerif.variable} ${notoDevanagari.variable} antialiased min-h-screen flex flex-col bg-background text-on-surface font-body-md`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
