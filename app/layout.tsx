import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const display = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = "https://eunhasu-cf1c.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "은하수 | AI 사주 해석",
    template: "%s | 은하수",
  },
  description:
    "생년월일을 입력하면 AI가 풀어낸 사주 이야기와 당신만의 별자리를 무료로 보여드립니다. 오행, 성격, 연애운, 재물운까지 한눈에.",
  keywords: [
    "사주",
    "사주풀이",
    "AI 사주",
    "무료 사주",
    "생년월일 운세",
    "오행",
    "사주 해석",
    "별자리",
    "사주팔자",
  ],
  authors: [{ name: "은하수" }],
  openGraph: {
    title: "은하수 | AI 사주 해석",
    description:
      "생년월일을 입력하면 AI가 풀어낸 사주 이야기와 당신만의 별자리를 무료로 보여드립니다.",
    url: siteUrl,
    siteName: "은하수",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "은하수 | AI 사주 해석",
    description:
      "생년월일을 입력하면 AI가 풀어낸 사주 이야기와 당신만의 별자리를 무료로 보여드립니다.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${display.variable} ${body.variable}`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8671116107075112"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}

