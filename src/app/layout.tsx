
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import SearchBar from "./components/layoutButtons/layoutSearch";
import LayoutLink from "./components/layoutButtons/LayoutLink";
import { Suspense } from "react";
import { base_metadata } from "./utils/baseMetaData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const outfit = Outfit({weight: "400", subsets: ["latin"]});
export const metadata = base_metadata;

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
        <div className={"header w-full sticky top-0 overflow-hidden p-2 bg-[var(--layout-bar-back)] text-base z-10 " + outfit.className}>
          <div className="flex flex-row">
          <div className="w-1/2 ">
            <LayoutLink href="/" text="Recent Submissions"></LayoutLink>
            <LayoutLink href="/browse" text="Browse All"></LayoutLink>
            <LayoutLink href="/snippet/new" text="Create"></LayoutLink>
          </div>
          <div className="w-1/2" dir="rtl">
          <Suspense>
            <SearchBar></SearchBar>
          </Suspense>
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
