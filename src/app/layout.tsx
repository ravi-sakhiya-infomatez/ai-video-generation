import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "AI Video Generator | Transform Product URLs into Video Ads",
  description: "Generate professional video ads from Amazon and Shopify product URLs in seconds using AI. Built with Next.js, Remotion, and GPT-4.",
  keywords: ["AI video generator", "product video ads", "ecommerce video maker", "remotion", "nextjs", "gpt-4", "ad generator"],
  openGraph: {
    title: "AI Video Generator | Transform Product URLs into Video Ads",
    description: "Instantly create high-converting video ads from any product link.",
    type: "website",
    locale: "en_US",
    siteName: "AI Video Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video Generator",
    description: "Generate marketing videos from product URLs automatically.",
  },
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
