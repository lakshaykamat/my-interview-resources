import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { SiteNavbar } from "@/components/site-navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interview Notes",
  description: "A clean Notion-powered interview notes reader.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeInitScript />
        <SiteNavbar />
        {children}
      </body>
    </html>
  );
}

function ThemeInitScript() {
  const code = `
    try {
      var storedTheme = window.localStorage.getItem("notes-page-theme");
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (storedTheme === "dark" || (storedTheme !== "light" && prefersDark)) {
        document.documentElement.classList.add("dark");
      }
    } catch (_) {}
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
