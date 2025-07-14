'use client'

import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "@/lib/notifications/client";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <NotificationProvider>
              {children}
              <Toaster />
            </NotificationProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
