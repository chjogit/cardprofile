import Link from "next/link";
import { CardView } from "@/components/CardView";
import type { Card } from "@/lib/types";

const SAMPLES: Card[] = [
  {
    themeId: "mint",
    accent: "",
    background: "",
    font: "round",
    blocks: [
      { id: "a1", type: "profile", name: "김하늘", bio: "식물 키우는 일러스트레이터", avatar: "" },
      { id: "a2", type: "link", label: "작업 포트폴리오", url: "https://example.com" },
      { id: "a3", type: "link", label: "굿즈 스토어", url: "https://example.com" },
    ],
  },
  {
    themeId: "sunset",
    accent: "",
    background: "",
    font: "sans",
    blocks: [
      { id: "b1", type: "profile", name: "박준", bio: "주말마다 공연하는 밴드 보컬", avatar: "" },
      { id: "b2", type: "link", label: "새 싱글 듣기", url: "https://example.com" },
      {
        id: "b3",
        type: "socials",
        items: [
          { platform: "instagram", value: "example" },
          { platform: "youtube", value: "example" },
          { platform: "kakao", value: "example" },
        ],
      },
    ],
  },
  {
    themeId: "night",
    accent: "",
    background: "",
    font: "sans",
    blocks: [
      { id: "c1", type: "profile", name: "이서연", bio: "프론트엔드 개발자", avatar: "" },
      { id: "c2", type: "link", label: "기술 블로그", url: "https://example.com" },
      {
        id: "c3",
        type: "socials",
        items: [
          { platform: "github", value: "example" },
          { platform: "naverblog", value: "example" },
        ],
      },
    ],
  },
];

const FAN = [
  { rotate: -9, x: "-1", z: 1, delay: "0.15s" },
  { rotate: 0, x: "0", z: 3, delay: "0s" },
  { rotate: 9, x: "1", z: 2, delay: "0.3s" },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col overflow-x-hidden">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          카드프로필
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/login" className="btn btn-ghost">
            로그인
          </Link>
          <Link href="/login?mode=signup" className="btn btn-primary hidden sm:inline-flex">
            카드 만들기
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1fr_1.15fr]">
        <div className="max-w-xl">
          <h1 className="text-[2.6rem] font-bold leading-[1.15] tracking-tight sm:text-6xl">
            링크 하나에
            <br />
            나를 담는 카드
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            블록을 끌어다 놓고 색을 고르면 끝이에요. 저장하면 바로 나만의 주소가 생기고,
            휴대폰에서도 그대로 보여요.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login?mode=signup" className="btn btn-primary px-6 py-3 text-base">
              무료로 카드 만들기
            </Link>
          </div>
          <p className="mt-6 text-sm text-ink-soft">
            주소는 <span className="font-semibold text-ink">cardprofile.app/내아이디</span> 형태로
            만들어져요.
          </p>
        </div>

        <div className="relative mx-auto h-[440px] w-full max-w-[560px] [--spread:34%] sm:h-[520px] sm:[--spread:62%]" aria-hidden="true">
          {SAMPLES.map((card, i) => (
            <div
              key={i}
              className="fan-card absolute left-1/2 top-1/2 w-[230px] sm:w-[270px]"
              style={
                {
                  zIndex: FAN[i].z,
                  transform: `translate(calc(-50% + ${FAN[i].x} * var(--spread)), -50%) rotate(${FAN[i].rotate}deg)`,
                  animationDelay: FAN[i].delay,
                  "--fx": `calc(-50% + ${FAN[i].x} * var(--spread))`,
                } as React.CSSProperties
              }
            >
              <div className="pointer-events-none overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(21,23,42,0.45)]">
                <CardView card={card} className="!py-6 !px-3 [&_article]:!p-5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
