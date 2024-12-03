import "./globals.css";
import localFont from "next/font/local";

const inter = localFont({
  src: [
    {
      path: "../public/fonts/extras/woff-hinted/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/extras/woff-hinted/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter", // 可选：CSS变量名
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
