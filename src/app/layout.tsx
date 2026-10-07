import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { env } from "@/lib/env";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_APP_NAME} - Nền tảng Dạy và Học Toán Chuyên Nghiệp`,
  description:
    "Ứng dụng dạy và học Toán GDPT 2018 tích hợp Gia sư AI Socrates, ngân hàng bài tập tự động chấm và quản lý lớp học linh hoạt.",
  keywords: ["Toán học", "Học toán online", "GDPT 2018", "MathLab", "Gia sư AI Socrates"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
