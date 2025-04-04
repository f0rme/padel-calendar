import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Padel Calendar",
  description: "Book padel activities, courts and coaching",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="flex items-center justify-between p-4 bg-slate-50 border-b">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              Padel Calendar
            </Link>
            <Link href="/calendar" className="hover:underline">
              Calendar
            </Link>
          </div>
        </nav>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
