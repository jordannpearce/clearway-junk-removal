import type { Metadata } from "next";
import { Newsreader, Outfit } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://127.0.0.1:43123"),
  title: {
    default: `${site.name} | Junk Hauling in Hayward, California`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "junk hauling Hayward",
    "debris removal Hayward CA",
    "junk removal Alameda County",
    "junk removal Contra Costa County",
    "same day junk hauling East Bay",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
