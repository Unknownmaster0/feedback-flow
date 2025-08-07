import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/context/AuthProvider";
// import CustomSessionProvider from "@/context/CustomsessionProvider";
import { Separator } from "@/components/ui/separator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feedback Flow",
  description: "FeedbackFlow is a comprehensive feedback collection platform designed to bridge the gap between feedback providers and recipients. Built with modern web technologies, it enables seamless anonymous feedback collection, AI-powered suggestions, and easy integration into personal portfolios and professional websites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      {/* <CustomSessionProvider> */}
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Navbar />
            <Separator className="border-2" />
            {children}
            <Toaster />
          </body>
        </html>
      {/* </CustomSessionProvider> */}
    </AuthProvider>
  );
}
