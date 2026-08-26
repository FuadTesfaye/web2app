import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFE600",
};

export const metadata: Metadata = {
  title: "web2app — Turn Any Web App into Standalone Native Apps",
  description: "Convert Next.js, Vite, React, Python, or any live web URL into standalone native Android, Windows, Debian, and Arch apps with a single command.",
  keywords: ["web2app", "nextjs to apk", "react to app", "neobrutalism", "convert web to native", "multi-platform compiler"],
  authors: [{ name: "web2app team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="theme-default overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&family=Plus+Jakarta+Sans:wght@500;700;800&family=Space+Grotesk:wght@500;700&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-pattern text-ink antialiased selection:bg-accent-yellow selection:text-ink min-h-screen w-full max-w-full overflow-x-hidden m-0 p-0">
        {children}
      </body>
    </html>
  );
}
