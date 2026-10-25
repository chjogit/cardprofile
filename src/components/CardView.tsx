import type { CSSProperties } from "react";
import { DEFAULT_FONT, fontStack } from "@/lib/fonts";
import { normalizeUrl, socialUrl } from "@/lib/social";
import { backgroundCss, hexToRgba } from "@/lib/themes";
import type { Block, ButtonStyle, Card, Design, IconShape, TextStyle } from "@/lib/types";
import { FontLoader } from "./FontLoader";
import { SOCIAL_NAMES, SocialIcon } from "./SocialIcon";

export function textCss(s: TextStyle | undefined, defaultSize: number): CSSProperties {
  return {
    fontFamily: fontStack(s?.font),
    fontSize: s?.size ?? defaultSize,
    color: s?.color,
    fontWeight: s?.bold === undefined ? undefined : s.bold ? 700 : 400,
    fontStyle: s?.italic ? "italic" : undefined,
    textDecoration: s?.underline ? "underline" : undefined,
    textUnderlineOffset: s?.underline ? "0.2em" : undefined,
    textAlign: s?.align,
  };
}

const SHAPE_RADIUS: Record<IconShape | "pill", string> = {
  pill: "999px",
  circle: "999px",
  rounded: "14px",
  square: "0px",
};

function buttonCss(d: Design, b: ButtonStyle | undefined): CSSProperties {
  const variant = b?.variant ?? d.buttonVariant;
  const shape = b?.shape ?? d.buttonShape;
  const bg = b?.bg ?? d.accent;
  const color = b?.color ?? (variant === "fill" ? d.onAccent : bg);
  const base: CSSProperties = { borderRadius: SHAPE_RADIUS[shape === "rounded" ? "rounded" : shape] };
  if (variant === "outline") return { ...base, background: "transparent", color, border: `2px solid ${bg}` };
  if (variant === "soft") return { ...base, background: hexToRgba(bg, 18), color: b?.color ?? d.text };
  return { ...base, background: bg, color, border: "2px solid transparent" };
}

function BlockView({ block, design }: { block: Block; design: Design }) {
  switch (block.type) {
    case "profile": {
      const size = block.avatarSize ?? 96;
      const radius = SHAPE_RADIUS[block.avatarShape ?? "circle"];
      return (
        <div className="flex flex-col items-center gap-3 pt-2 text-center">
          {block.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.avatar}
              alt=""
              className="object-cover"
              style={{ width: size, height: size, borderRadius: radius }}
            />
          ) : (
            <div
              className="grid place-items-center font-semibold"
              style={{
                width: size,
                height: size,
                borderRadius: radius,
                fontSize: size / 3,
                background: design.accent,
                color: design.onAccent,
              }}
              aria-hidden="true"
            >
              {block.name.trim().charAt(0) || "?"}
            </div>
          )}
          <div className="w-full">
            <h1 className="font-bold leading-tight break-keep" style={textCss(block.nameStyle, 24)}>
              {block.name}
            </h1>
            {block.bio && (
              <p
                className="mt-1.5 leading-relaxed break-keep whitespace-pre-line"
                style={{ color: "var(--muted)", ...textCss(block.bioStyle, 15) }}
              >
                {block.bio}
              </p>
            )}
          </div>
        </div>
      );
    }
    case "text":
      return (
        <p className="text-center leading-relaxed break-keep whitespace-pre-line" style={textCss(block.style, 15)}>
          {block.text}
        </p>
      );
    case "link":
      return (
        <a
          href={normalizeUrl(block.url) || undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="card-link block w-full px-5 py-3.5 text-center font-semibold transition-transform active:scale-[0.98]"
          style={{ ...buttonCss(design, block.button), ...textCss(block.style, 15) }}
        >
          {block.label || block.url}
        </a>
      );
    case "socials": {
      const ic = block.icon ?? {};
      const size = ic.size ?? 44;
      const color = ic.color ?? design.text;
      return (
        <div className="flex flex-wrap justify-center gap-2">
          {block.items
            .filter((it) => it.value.trim())
            .map((it, i) => (
              <a
                key={i}
                href={socialUrl(it.platform, it.value)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={SOCIAL_NAMES[it.platform]}
                title={SOCIAL_NAMES[it.platform]}
                className="grid place-items-center transition-opacity hover:opacity-75"
                style={{
                  width: size,
                  height: size,
                  borderRadius: SHAPE_RADIUS[ic.shape ?? "circle"],
                  ...(ic.filled
                    ? { background: color, color: design.cardBg }
                    : { border: `1px solid ${hexToRgba(color, 30)}`, color }),
                }}
              >
                <SocialIcon platform={it.platform} size={Math.round(size * 0.45)} />
              </a>
            ))}
        </div>
      );
    }
    case "image":
      return block.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={block.src} alt={block.alt} className="w-full object-cover" style={{ borderRadius: block.radius ?? 12 }} />
      ) : (
        <div
          className="grid aspect-video w-full place-items-center text-sm"
          style={{ border: `1px dashed ${hexToRgba(design.text, 30)}`, color: "var(--muted)", borderRadius: 12 }}
        >
          이미지를 추가해주세요
        </div>
      );
    case "divider":
      return <hr className="h-px border-0" style={{ background: block.color ?? hexToRgba(design.text, 15) }} />;
  }
}

/** 카드에 쓰인 모든 글꼴 id */
export function usedFonts(card: Card): string[] {
  const ids = [card.design.font || DEFAULT_FONT];
  for (const b of card.blocks) {
    const styles =
      b.type === "profile" ? [b.nameStyle, b.bioStyle] : b.type === "text" || b.type === "link" ? [b.style] : [];
    for (const s of styles) if (s?.font) ids.push(s.font);
  }
  return ids;
}

/** 카드 한 장. 에디터 미리보기와 공개 페이지가 같은 컴포넌트를 쓴다. */
export function CardView({ card, className = "" }: { card: Card; className?: string }) {
  const d = card.design;
  return (
    <div
      className={`flex w-full items-center justify-center px-4 py-10 sm:py-16 ${className}`}
      style={
        {
          "--muted": d.muted,
          background: backgroundCss(d),
          color: d.text,
          fontFamily: fontStack(d.font) ?? fontStack(DEFAULT_FONT),
        } as CSSProperties
      }
    >
      <FontLoader ids={usedFonts(card)} />
      <article
        className="flex w-full max-w-[420px] flex-col gap-4 p-6 sm:p-8"
        style={{
          background: hexToRgba(d.cardBg, d.cardOpacity),
          border: d.borderWidth ? `${d.borderWidth}px solid ${hexToRgba(d.cardBorder, d.blur ? 45 : 100)}` : "none",
          borderRadius: d.radius,
          backdropFilter: d.blur ? "blur(18px) saturate(140%)" : undefined,
          WebkitBackdropFilter: d.blur ? "blur(18px) saturate(140%)" : undefined,
          boxShadow: d.shadow ? "0 24px 48px -24px rgba(20,20,50,0.3)" : undefined,
        }}
      >
        {card.blocks.map((b) => (
          <BlockView key={b.id} block={b} design={d} />
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
