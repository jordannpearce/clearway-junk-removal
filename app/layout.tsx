import type { Metadata } from "next";
import { Newsreader, Outfit } from "next/font/google";
import Script from "next/script";
import { publicSiteUrl, site } from "@/lib/site";
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
  metadataBase: new URL(publicSiteUrl()),
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
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${site.gaMeasurementId}`}
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${site.gaMeasurementId}');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
