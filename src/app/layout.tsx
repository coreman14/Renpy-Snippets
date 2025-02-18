import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import SearchBar from "./components/searchInput";
import LayoutLink from "./components/LayoutLink";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const outfit = Outfit({weight: "400"});

export const metadata: Metadata = {
  title: "Renpy Snippets",
  description: "App to create and share renpy snippets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <div className={"header w-full sticky top-0 overflow-hidden p-2 text-base " + outfit.className}  style={{background: "#FFA48C"}}>
          <div className="flex flex-row">
          <div className="w-1/2 ">
            <LayoutLink href="/" text="Most Recent"></LayoutLink>
            <LayoutLink href="/browse" text="Browse"></LayoutLink>
            <LayoutLink href="/entry/new" text="Create"></LayoutLink>
          </div>
          <div className="w-1/2" dir="rtl">
            <SearchBar></SearchBar>
            {/* //TODO: Admin button needs a client component that checks for cookie-id*/}
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
