import type { Metadata, Viewport } from "next";
import { Inter, Libre_Baskerville } from "next/font/google";
import { invite } from "@/lib/invite";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const title = `${invite.title} · ${invite.eventName}`;
const description = `${invite.tagline} ${invite.house.body[0]}`;

export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL && {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  }),
  title,
  description,
  applicationName: invite.brand,
  authors: [{ name: invite.brand }],
  openGraph: {
    title,
    description,
    siteName: invite.brand,
    images: [{ url: invite.ogImage, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [invite.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#7b1e3a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${libreBaskerville.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
