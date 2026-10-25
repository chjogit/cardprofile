import { DEFAULT_FONT } from "./fonts";
import type { Card, Design } from "./types";

export type Preset = { id: string; name: string; design: Design };

const base: Design = {
  bgType: "solid",
  bg1: "#E9E7E2",
  bg2: "#FFFFFF",
  bgAngle: 160,
  cardBg: "#FFFFFF",
  cardOpacity: 100,
  cardBorder: "#E3E2E6",
  borderWidth: 1,
  radius: 20,
  blur: false,
  shadow: true,
  text: "#1C1B22",
  muted: "#6B6A73",
  accent: "#1C1B22",
  onAccent: "#FFFFFF",
  font: DEFAULT_FONT,
  buttonShape: "pill",
  buttonVariant: "fill",
};

export const PRESETS: Preset[] = [
  { id: "paper", name: "종이", design: base },
  {
    id: "sunset",
    name: "노을",
    design: {
      ...base,
      bgType: "gradient",
      bg1: "#FF8A5B",
      bg2: "#6B4BFF",
      cardBg: "#FFFFFF",
      cardOpacity: 18,
      cardBorder: "#FFFFFF",
      radius: 28,
      blur: true,
      text: "#FFFFFF",
      muted: "#FFE6EE",
      accent: "#FFFFFF",
      onAccent: "#C93A63",
    },
  },
  {
    id: "night",
    name: "밤",
    design: {
      ...base,
      bg1: "#101322",
      cardBg: "#1A1F36",
      cardBorder: "#2C3557",
      radius: 16,
      text: "#EEF1FF",
      muted: "#9AA3C7",
      accent: "#8FB8FF",
      onAccent: "#101322",
      buttonShape: "rounded",
    },
  },
  {
    id: "mint",
    name: "민트",
    design: {
      ...base,
      bg1: "#D8F1E6",
      cardBorder: "#CBE9DC",
      radius: 32,
      text: "#143D31",
      muted: "#5C7F73",
      accent: "#1F8A6B",
      font: "pretendard",
    },
  },
  {
    id: "blossom",
    name: "벚꽃",
    design: {
      ...base,
      bgType: "gradient",
      bg1: "#FFE3EC",
      bg2: "#FFF6E5",
      cardBorder: "#F8D3DF",
      radius: 24,
      text: "#5A2236",
      muted: "#9C6577",
      accent: "#F27BA1",
      onAccent: "#FFFFFF",
      font: "g-gowun-dodum",
      buttonVariant: "soft",
    },
  },
  {
    id: "mono",
    name: "모노",
    design: {
      ...base,
      bg1: "#FFFFFF",
      cardBorder: "#111111",
      borderWidth: 2,
      radius: 0,
      shadow: false,
      text: "#111111",
      muted: "#555555",
      accent: "#111111",
      font: "g-space-grotesk",
      buttonShape: "square",
      buttonVariant: "outline",
    },
  },
];

export function getPreset(id: string): Preset {
  return PRESETS.find((p) => p.id === id) ?? PRESETS[0];
}

export function backgroundCss(d: Design): string {
  return d.bgType === "gradient" ? `linear-gradient(${d.bgAngle}deg, ${d.bg1}, ${d.bg2})` : d.bg1;
}

export function hexToRgba(hex: string, opacity: number): string {
  const m = hex.replace("#", "");
  if (m.length !== 6) return hex;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},${opacity / 100})`;
}

// 예전 형식(themeId, accent, background, font)으로 저장된 카드를 새 형식으로 바꾼다.
const OLD_FONTS: Record<string, string> = { sans: DEFAULT_FONT, serif: "g-gowun-batang", round: "g-jua" };

export function normalizeCard(raw: unknown): Card {
  const c = raw as Partial<Card> & {
    themeId?: string;
    accent?: string;
    background?: string;
    font?: string;
  };
  const presetId = c.preset ?? c.themeId ?? "paper";
  const design: Design = { ...getPreset(presetId).design, ...(c.design ?? {}) };
  if (!c.design) {
    if (c.accent) design.accent = c.accent;
    if (c.background?.startsWith("#")) {
      design.bgType = "solid";
      design.bg1 = c.background;
    }
    if (c.font) design.font = OLD_FONTS[c.font] ?? DEFAULT_FONT;
  }
  const blocks = (c.blocks ?? []).map((b) =>
    b.type === "socials"
      ? {
          ...b,
          items: b.items.map((it) => ({
            platform: it.platform,
            value: it.value ?? (it as { url?: string }).url ?? "",
          })),
        }
      : b,
  );
  return { preset: presetId, design, blocks };
}
