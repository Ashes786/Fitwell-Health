import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProviderWrapper } from "@/components/providers/session-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import "@/lib/chunk-error-handler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HealthPay Telehealth Platform",
  description: "Comprehensive telehealth platform connecting patients, doctors, and healthcare providers with seamless appointment booking, video consultations, and electronic health records.",
  keywords: ["HealthPay", "Telehealth", "Healthcare", "Medical", "Appointments", "EHR", "Telemedicine"],
  authors: [{ name: "HealthPay Team" }],
  openGraph: {
    title: "HealthPay Telehealth Platform",
    description: "Comprehensive telehealth platform for modern healthcare",
    url: "https://healthpay.com",
    siteName: "HealthPay",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealthPay Telehealth Platform",
    description: "Comprehensive telehealth platform for modern healthcare",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <SessionProviderWrapper>
          <ErrorBoundary>
            {children}
            <Toaster />
          </ErrorBoundary>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
