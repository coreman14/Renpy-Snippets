import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import SearchBar from "./components/searchInput";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Renpy Snippets",
  description: "App to create and share renpy snippets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //TODO: Cookie check here
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="header w-full sticky top-0 overflow-hidden bg-black">
          <div className="flex flex-row">
          <div className="w-1/2 ">
            <Link className="whitespace-nowrap" href="/">Home Logo</Link>
            <Link className="whitespace-nowrap" href="/browse">Browse</Link>
            <Link className="whitespace-nowrap" href="/entry/new">Create Snippet</Link>
          </div>
          <div className="w-1/2" dir="rtl">
            <SearchBar></SearchBar>
            <span className="whitespace-nowrap">Admin Button</span>
        </div>
        </div>
        </div>
        <div className="m-2">
        {children}

        </div>
      </body>
    </html>
  );
}
