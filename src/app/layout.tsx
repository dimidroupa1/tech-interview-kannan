"use client"

import type { Metadata } from "next";
import { Montserrat, Roboto_Slab } from "next/font/google";
import "./globals.css";
import CustomProvider from "@/lib/providers/CustomProvider";
import { SessionProvider } from "next-auth/react";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";
import StyledComponentsRegistry from "@/lib/registry";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-robot-slab",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${robotoSlab.variable}`}>
        <ReduxProvider>
          <SessionProvider>
            <CustomProvider>{children}</CustomProvider>
          </SessionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
