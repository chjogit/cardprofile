import type { CSSProperties } from "react";
import { normalizeUrl, socialUrl } from "@/lib/social";
import { getFont, getTheme } from "@/lib/themes";
import type { Block, Card } from "@/lib/types";
import { SOCIAL_NAMES, SocialIcon } from "./SocialIcon";

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "profile":
      return (
        <div className="flex flex-col items-center text-center gap-3 pt-2">
          {block.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.avatar}
              alt=""
              className="h-24 w-24 rounded-full object-cover"
              style={{ boxShadow: "0 0 0 4px var(--card-bg), 0 0 0 5px var(--card-border)" }}
            />
          ) : (
            <div
              className="h-24 w-24 rounded-full grid place-items-center text-3xl font-semibold"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
              aria-hidden="true"
            >
              {block.name.trim().charAt(0) || "?"}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold leading-tight break-keep">{block.name}</h1>
            {block.bio && (
              <p className="mt-1.5 text-[15px] leading-relaxed break-keep whitespace-pre-line" style={{ color: "var(--muted)" }}>
                {block.bio}
              </p>
            )}
          </div>
        </div>
      );
    case "text":
      return (
        <p className="text-[15px] leading-relaxed text-center break-keep whitespace-pre-line">{block.text}</p>
      );
    case "link":
      return (
        <a
          href={normalizeUrl(block.url) || undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="card-link block w-full rounded-full px-5 py-3.5 text-center text-[15px] font-semibold transition-transform active:scale-[0.98]"
          style={{ background: "var(--accent)", color: "var(--on-accent)" }}
        >
          {block.label || block.url}
        </a>
      );
    case "socials":
      return (
        <div className="flex flex-wrap justify-center gap-2">
          {block.items.filter((it) => it.value.trim()).map((it, i) => (
            <a
              key={i}
              href={socialUrl(it.platform, it.value)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={SOCIAL_NAMES[it.platform]}
              title={SOCIAL_NAMES[it.platform]}
              className="grid h-11 w-11 place-items-center rounded-full transition-opacity hover:opacity-75"
              style={{ border: "1px solid var(--card-border)", color: "var(--text)" }}
            >
              <SocialIcon platform={it.platform} />
            </a>
          ))}
        </div>
      );
    case "image":
      return block.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={block.src} alt={block.alt} className="w-full object-cover" style={{ borderRadius: "calc(var(--radius) * 0.6)" }} />
      ) : (
        <div
          className="grid aspect-video w-full place-items-center text-sm"
          style={{ border: "1px dashed var(--card-border)", color: "var(--muted)", borderRadius: "calc(var(--radius) * 0.6)" }}
        >
          이미지를 추가해주세요
        </div>
      );
    case "divider":
      return <hr className="border-0 h-px" style={{ background: "var(--card-border)" }} />;
  }
}

export function cardStyle(card: Card): CSSProperties {
  const t = getTheme(card.themeId);
  const accent = card.accent || t.accent;
  return {
    "--card-bg": t.cardBg,
    "--card-border": t.cardBorder,
    "--text": t.text,
    "--muted": t.muted,
    "--accent": accent,
    "--on-accent": card.accent ? readableOn(card.accent) : t.onAccent,
    "--radius": t.radius,
    background: card.background || t.background,
    color: t.text,
    fontFamily: getFont(card.font).css,
  } as CSSProperties;
}

// 배경색 위에서 읽히는 글자색 (흰색/검은색)
export function readableOn(hex: string) {
  const m = hex.replace("#", "");
  if (m.length !== 6) return "#FFFFFF";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16) / 255);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.6 ? "#16161D" : "#FFFFFF";
}

/** 카드 한 장. 에디터 미리보기와 공개 페이지가 같은 컴포넌트를 쓴다. */
export function CardView({ card, className = "" }: { card: Card; className?: string }) {
  const t = getTheme(card.themeId);
  return (
    <div className={`flex w-full items-center justify-center px-4 py-10 sm:py-16 ${className}`} style={cardStyle(card)}>
      <article
        className="w-full max-w-[420px] flex flex-col gap-4 p-6 sm:p-8"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "var(--radius)",
          backdropFilter: t.blur ? "blur(18px) saturate(140%)" : undefined,
          WebkitBackdropFilter: t.blur ? "blur(18px) saturate(140%)" : undefined,
          boxShadow: "0 24px 48px -24px rgba(20,20,50,0.25)",
        }}
      >
        {card.blocks.map((b) => (
          <BlockView key={b.id} block={b} />
        ))}
        {card.blocks.length === 0 && (
          <p className="py-10 text-center text-sm" style={{ color: "var(--muted)" }}>
            왼쪽에서 블록을 추가해보세요
          </p>
        )}
      </article>
    </div>
  );
}
