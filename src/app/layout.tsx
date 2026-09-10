import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Bebas_Neue, Geist } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const barlow = Barlow_Condensed({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Flitz Beach Olympic Games",
  description: "Olympic Village on your phone. Flitz Events.",
  applicationName: "Beach Olympic Games",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Beach Olympics",
  },
  icons: {
    icon: "/icons/app-icon.png",
    apple: "/icons/app-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#071018",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl"
      className={`${geist.variable} ${bebas.variable} ${barlow.variable} h-full`}
    >
      <body className="min-h-full bg-navy antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
