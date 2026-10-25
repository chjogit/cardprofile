import type { Metadata } from "next";
import { Gowun_Batang, IBM_Plex_Sans_KR, Jua } from "next/font/google";
import "./globals.css";

const plex = IBM_Plex_Sans_KR({
  variable: "--font-plex",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const batang = Gowun_Batang({
  variable: "--font-batang",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const jua = Jua({
  variable: "--font-jua",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "카드프로필",
  description: "링크 하나로 나를 소개하는 프로필 카드를 만들어보세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${plex.variable} ${batang.variable} ${jua.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
