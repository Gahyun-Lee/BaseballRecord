import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Header from "@/components/layout/Header";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KBO 야구 기록",
  description: "KBO 경기 일정, 팀/선수 기록, 구장 정보를 한눈에",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1d4ed8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-gray-50 antialiased">
        <div className="max-w-lg mx-auto min-h-screen flex flex-col bg-white shadow-sm">
          <Header />
          <main className="flex-1 pb-20 flex flex-col">{children}</main>
          <Navbar />
        </div>
      </body>
    </html>
  );
}
