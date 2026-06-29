import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

export const metadata: Metadata = {
  title: "Yash Kaul — Designer · Motion · Direction",
  description:
    "Yash Kaul is a designer and motion director with 8 years behind the frame. Visual systems that move — and ship too.",
  keywords: [
    "Yash Kaul",
    "designer",
    "motion design",
    "creative director",
    "graphic design",
    "video editing",
    "portfolio",
  ],
  authors: [{ name: "Yash Kaul" }],
  openGraph: {
    title: "Yash Kaul — Designer · Motion · Direction",
    description:
      "Designer and motion director with 8 years behind the frame.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="creative"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <SmoothScroll>
            {children}
            <div className="grid-overlay" aria-hidden="true" />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
