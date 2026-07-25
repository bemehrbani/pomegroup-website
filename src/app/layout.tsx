import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-Q1JC2PRQGW";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pomegroup Studio — Technical Co-Founder Studio in Finland",
  description:
    "Helsinki-based technical co-founder & venture builder studio. We partner with domain experts in Finland and Europe as CTO co-founders to build SaaS, AI, and ESG products.",
  keywords: [
    "cofounder studio in finland",
    "technical cofounder finland",
    "venture studio finland",
    "co-builder studio helsinki",
    "co-founder as a service",
    "venture builder helsinki",
    "startup studio finland",
    "CTO as a service finland",
    "ESG",
    "AI",
    "SaaS",
  ],
  openGraph: {
    title: "Pomegroup Studio — Technical Co-Founder Studio in Finland",
    description:
      "Your second co-founder in Finland. We turn domain expertise into market-ready SaaS, AI, and ESG products.",
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
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Pomegroup Studio",
              "legalName": "Smart Monshi Oy",
              "url": "https://www.pomegroup.studio",
              "logo": "https://www.pomegroup.studio/images/logo-horizontal.png",
              "founder": {
                "@type": "Person",
                "name": "Mahdi Farimani"
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Saariselänkuja 2 D 51",
                "addressLocality": "Helsinki",
                "postalCode": "00970",
                "addressCountry": "FI"
              },
              "sameAs": [
                "https://www.linkedin.com/in/mahdifarimani/"
              ]
            })
          }}
        />
      </head>
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
