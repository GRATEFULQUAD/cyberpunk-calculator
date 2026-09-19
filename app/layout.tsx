import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/AppContext";
import { AppBackground } from "@/components/AppBackground";

export const metadata: Metadata = {
  title: "Neon Calc — Cyberpunk Calculator",
  description:
    "A futuristic all-in-one calculator: standard, scientific, tip, split, discount, unit price, converter, loan, and health — all local, no login.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Neon Calc",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>
          <div className="app-shell">
            <div className="fixed inset-0 bg-black z-0" />
            <AppBackground />
            <div className="relative z-10">{children}</div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
