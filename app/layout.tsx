import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";

// const roboto = Roboto({ subsets: ["latin"], weight: "700" });
const myFont = localFont({
  src: "../public/assets/fonts/Arial/arialbd.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Haier Report & Dashboard",
  description: "Custom report & dashboard portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${myFont.className}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
