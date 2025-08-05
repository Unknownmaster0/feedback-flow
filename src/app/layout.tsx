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
  description: "Simple feedback collection where sender is hidden",
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
