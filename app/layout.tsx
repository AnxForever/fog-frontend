import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import { SiteLayout } from "@/components/site-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "雾天语义分割展示站",
  description: "面向雾天交通道路场景的语义分割毕业设计展示网页。",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <SiteLayout>{children}</SiteLayout>
        </Providers>
      </body>
    </html>
  );
}
