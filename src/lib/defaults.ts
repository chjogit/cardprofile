import { nanoid } from "nanoid";
import type { Block, BlockType, Card } from "./types";

export const newId = () => nanoid(10);

export function createBlock(type: BlockType): Block {
  const id = newId();
  switch (type) {
    case "profile":
      return { id, type, name: "이름", bio: "나를 한 줄로 소개해보세요", avatar: "" };
    case "text":
      return { id, type, text: "여기에 내용을 적어보세요." };
    case "link":
      return { id, type, label: "새 링크", url: "" };
    case "socials":
      return { id, type, items: [{ platform: "instagram", value: "" }] };
    case "image":
      return { id, type, src: "", alt: "" };
    case "divider":
      return { id, type };
  }
}

export function defaultCard(name = "이름"): Card {
  return {
    themeId: "paper",
    accent: "",
    background: "",
    font: "sans",
    blocks: [
      { ...(createBlock("profile") as Extract<Block, { type: "profile" }>), name },
      createBlock("link"),
      createBlock("socials"),
    ],
  };
}

export const BLOCK_LABELS: Record<BlockType, string> = {
  profile: "프로필",
  text: "텍스트",
  link: "링크 버튼",
  socials: "소셜 아이콘",
  image: "이미지",
  divider: "구분선",
};

// 주소로 쓸 수 없는 이름 (앱의 다른 페이지와 겹침)
export const RESERVED_USERNAMES = new Set([
  "login",
  "editor",
  "api",
  "admin",
  "settings",
  "_next",
  "favicon.ico",
]);

export const USERNAME_RE = /^[a-z0-9][a-z0-9_-]{2,19}$/;
