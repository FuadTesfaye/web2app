import type { Metadata, Viewport } from "next";
import { RootProvider } from "fumadocs-ui/provider";
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
    <html lang="en" className="theme-default" suppressHydrationWarning>
      <body className="font-sans bg-pattern text-ink antialiased selection:bg-accent-yellow selection:text-ink min-h-screen w-full m-0 p-0">
        <RootProvider search={{ options: { type: "static" } }}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
