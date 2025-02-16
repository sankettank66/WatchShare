import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter, Space_Grotesk, Playfair_Display } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WatchShare - Real-Time Screen Sharing",
  description: "WatchShare allows users to instantly create a room and share their screen with others using a room code or a shareable link. Perfect for presentations, collaborations, and online classes.",
  keywords: "screen sharing, real-time sharing, create room, join room, live presentation, collaboration tool",
  authors: [{"name": "Sanket Tank",url:"https://sankettank.me"}],
  openGraph: {
    title: "WatchShare - Real-Time Screen Sharing",
    description: "WatchShare allows users to instantly create a room and share their screen with others using a room code or a shareable link. Perfect for presentations, collaborations, and online classes.",
    url: "https://watchshare.vercel.app", // Replace with your website URL
    siteName: "WatchShare",
    type: "website",
  },
  twitter: {
    site: "@sankettank6685", // Replace with your Twitter handle if available
    title: "WatchShare - Real-Time Screen Sharing",
    description: "WatchShare allows users to instantly create a room and share their screen with others using a room code or a shareable link.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
