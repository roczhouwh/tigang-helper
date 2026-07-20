import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "提肛助手 — 科学盆底肌训练",
  description: "科学分级训练课程，呼吸动画引导，AI姿势纠正，帮你轻松练对盆底肌",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream">
        <Navbar />
        <main className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}