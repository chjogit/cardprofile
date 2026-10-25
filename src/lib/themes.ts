import type { FontId } from "./types";

export type Theme = {
  id: string;
  name: string;
  // 카드 바깥 배경. 사용자가 배경색을 고르면 이 값 대신 쓴다.
  background: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  muted: string;
  accent: string;
  // 링크 버튼 글자색 (accent 위에 올라감)
  onAccent: string;
  radius: string;
  blur: boolean;
};

export const THEMES: Theme[] = [
  {
    id: "paper",
    name: "종이",
    background: "#E9E7E2",
    cardBg: "#FFFFFF",
    cardBorder: "rgba(20,20,40,0.08)",
    text: "#1C1B22",
    muted: "#6B6A73",
    accent: "#1C1B22",
    onAccent: "#FFFFFF",
    radius: "20px",
    blur: false,
  },
  {
    id: "sunset",
    name: "노을",
    background: "linear-gradient(160deg, #FF9A62 0%, #F2557A 45%, #6B4BFF 100%)",
    cardBg: "rgba(255,255,255,0.18)",
    cardBorder: "rgba(255,255,255,0.35)",
    text: "#FFFFFF",
    muted: "rgba(255,255,255,0.78)",
    accent: "#FFFFFF",
    onAccent: "#C93A63",
    radius: "28px",
    blur: true,
  },
  {
    id: "night",
    name: "밤",
    background: "#101322",
    cardBg: "#1A1F36",
    cardBorder: "rgba(143,184,255,0.18)",
    text: "#EEF1FF",
    muted: "#9AA3C7",
    accent: "#8FB8FF",
    onAccent: "#101322",
    radius: "16px",
    blur: false,
  },
  {
    id: "mint",
    name: "민트",
    background: "#D8F1E6",
    cardBg: "#FFFFFF",
    cardBorder: "rgba(31,138,107,0.15)",
    text: "#143D31",
    muted: "#5C7F73",
    accent: "#1F8A6B",
    onAccent: "#FFFFFF",
    radius: "32px",
    blur: false,
  },
];

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export const FONTS: { id: FontId; name: string; css: string }[] = [
  { id: "sans", name: "고딕", css: "var(--font-plex), system-ui, sans-serif" },
  { id: "serif", name: "명조", css: "var(--font-batang), serif" },
  { id: "round", name: "둥근체", css: "var(--font-jua), system-ui, sans-serif" },
];

export function getFont(id: FontId) {
  return FONTS.find((f) => f.id === id) ?? FONTS[0];
}
