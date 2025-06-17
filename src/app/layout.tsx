import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const generalSans = localFont({
  src: [
    {
      path: "../../public/fonts/GeneralSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/GeneralSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/GeneralSans-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans-SemiboldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/GeneralSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/GeneralSans-Extralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans-ExtralightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/GeneralSans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
  ],
  variable: "--font-general-sans",
});

export const metadata: Metadata = {
  title: "Tarana-ai | Plan Your Perfect Baguio Trip",
  description: "Tarana.ai is an AI-powered travel platform that creates real-time, personalized itineraries using live data from traffic, crowd density, weather, and mobility patterns. Built initially for Baguio City, Tarana helps tourists avoid congestion, discover hidden local gems, and enjoy smoother, more meaningful trips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${generalSans.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
