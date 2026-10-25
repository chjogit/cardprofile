import type { Metadata } from "next";
import "./globals.css";

// next/font는 빌드할 때 맥용(힌팅 없는) 글꼴 파일을 받아 직접 올려서, Windows에서 작은 한글이 흐릿하게 보인다.
// Google Fonts 주소로 바로 받으면 브라우저마다 맞는 파일(Windows는 힌팅 버전)을 준다.
const PLEX_CSS = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700&display=swap";

export const metadata: Metadata = {
  title: "카드프로필",
  description: "링크 하나로 나를 소개하는 프로필 카드를 만들어보세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={PLEX_CSS} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
