import type { Metadata } from "next";
import { Inter, Outfit, Manrope } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";

// Inter for body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

// Outfit - bold, geometric, modern (similar to PP Pangram Sans Compact)
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-pangram",
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

// Manrope - clean, distinctive (similar to PP Object Sans)
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-object",
  weight: ['600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Recify - Recipe App",
  description: "Organize and discover amazing recipes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(
        inter.variable,
        outfit.variable,
        manrope.variable,
        "font-[family-name:var(--font-inter)]",
        "text-[#1A0803]",
        "bg-[#F9F5F1]"
      )}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
