import type { Metadata } from "next";
import { Montserrat, Roboto_Slab } from "next/font/google";
import "./globals.css";

import CustomProvider from "@/lib/providers/CustomProvider";
import { headers } from "next/headers";
import { SessionProvider } from "next-auth/react";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-robot-slab",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie") || "";

  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${robotoSlab.variable}`}>
        <CustomProvider cookies={cookies}>{children}</CustomProvider>
      </body>
    </html>
  );
}
