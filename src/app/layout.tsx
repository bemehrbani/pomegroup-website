import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pomegroup Studio — Digital Venture Builder",
  description:
    "Helsinki-based venture builder studio. We become your second co-founder, turning domain expertise into market-ready products. AI, SaaS, Web3, and mobile development.",
  keywords: [
    "venture builder",
    "startup studio",
    "co-founder as a service",
    "Helsinki",
    "Finland",
    "ESG",
    "AI",
    "SaaS",
    "Web3",
  ],
  openGraph: {
    title: "Pomegroup Studio — Digital Venture Builder",
    description:
      "We become your second co-founder. Helsinki-based studio turning domain expertise into market-ready products.",
    url: "https://pomegroup.studio",
    siteName: "Pomegroup Studio",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
