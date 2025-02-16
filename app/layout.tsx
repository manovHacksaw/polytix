import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/Navbar";
import { Providers } from "@/lib/redux/provider";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeProvider";
import { ToastProvider } from "@radix-ui/react-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ToastProvider>
    <html lang="en" suppressHydrationWarning>
      <Providers>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange><NavBar/>
        {children}
        <Footer/></ThemeProvider>
        
      </body>
      
      </Providers>
      
    </html>
    </ToastProvider>
  );
}
