import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Anger Management Plan Generator",
  description: "Generate structured anger management programs with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0f] text-[#ededf4]">
        <div className="mx-auto max-w-3xl px-4 py-12">{children}</div>
      </body>
    </html>
  );
}
