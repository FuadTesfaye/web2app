import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "web2app — Turn Any Web App into Standalone Native Apps",
  description: "Convert Next.js, Vite, React, Python, or any live web URL into standalone native Android, Windows, Debian, and Arch apps with a single command.",
  keywords: ["web2app", "nextjs to apk", "react to app", "neobrutalism", "convert web to native"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="theme-default">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&family=Plus+Jakarta+Sans:wght@500;700;800&family=Space+Grotesk:wght@500;700&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-pattern text-ink antialiased selection:bg-accent-yellow selection:text-ink">
        {children}
      </body>
    </html>
  );
}
