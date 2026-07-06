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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Interview Notes",
    template: "%s | Interview Notes",
  },
  description: "A clean Notion-powered interview notes reader.",
  openGraph: {
    type: "website",
    siteName: "Interview Notes",
    title: "Interview Notes",
    description: "A clean Notion-powered interview notes reader.",
  },
  twitter: {
    card: "summary",
    title: "Interview Notes",
    description: "A clean Notion-powered interview notes reader.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
