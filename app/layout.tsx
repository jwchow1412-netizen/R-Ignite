import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from "next";
import type { User } from "@supabase/supabase-js";
import localFont from "next/font/local";
import { Space_Grotesk } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { hasSupabaseEnv } from "@/utils/supabase/config";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "MASA Hackathon 2026: R-Ignite",
  description:
    "Official site for MASA Hackathon 2026: R-Ignite, a two-month actuarial innovation challenge bridging academia and industry.",
  icons: {
    icon: "/logo.svg",
  },
};

import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user: User | null = null;

  if (hasSupabaseEnv()) {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <Navbar user={user} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
      <GoogleAnalytics gaId="G-RY1EQBB6YJ" />
    </html>
  );
}
