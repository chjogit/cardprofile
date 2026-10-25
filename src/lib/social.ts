import type { SocialPlatform } from "./types";

type PlatformInfo = {
  name: string;
  placeholder: string;
  // 아이디로 주소를 만든다. 사용자가 전체 주소를 넣으면 그 주소를 그대로 쓴다.
  fromId: (id: string) => string;
};

// 화면에 보이는 순서. 한국에서 많이 쓰는 서비스를 앞에 둔다.
export const PLATFORMS: Record<SocialPlatform, PlatformInfo> = {
  instagram: { name: "인스타그램", placeholder: "아이디", fromId: (id) => `https://www.instagram.com/${id}` },
  youtube: { name: "유튜브", placeholder: "채널 핸들 (@ 없이)", fromId: (id) => `https://www.youtube.com/@${id}` },
  kakao: {
    name: "카카오톡 채널",
    placeholder: "채널 ID 또는 오픈채팅 주소",
    fromId: (id) => `https://pf.kakao.com/${id.startsWith("_") ? id : `_${id}`}`,
  },
  naverblog: { name: "네이버 블로그", placeholder: "블로그 아이디", fromId: (id) => `https://blog.naver.com/${id}` },
  threads: { name: "스레드", placeholder: "아이디", fromId: (id) => `https://www.threads.net/@${id}` },
  tiktok: { name: "틱톡", placeholder: "아이디", fromId: (id) => `https://www.tiktok.com/@${id}` },
  x: { name: "X (트위터)", placeholder: "아이디", fromId: (id) => `https://x.com/${id}` },
  facebook: { name: "페이스북", placeholder: "아이디", fromId: (id) => `https://www.facebook.com/${id}` },
  github: { name: "GitHub", placeholder: "아이디", fromId: (id) => `https://github.com/${id}` },
  linkedin: { name: "LinkedIn", placeholder: "프로필 아이디", fromId: (id) => `https://www.linkedin.com/in/${id}` },
  email: { name: "이메일", placeholder: "me@example.com", fromId: (id) => `mailto:${id}` },
  website: { name: "웹사이트", placeholder: "example.com", fromId: (id) => `https://${id}` },
};

export const PLATFORM_ORDER = Object.keys(PLATFORMS) as SocialPlatform[];

/** 링크 버튼 주소: "naver.com"처럼 적어도 https://를 붙여 이동할 수 있게 한다. */
export function normalizeUrl(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  if (/^(https?:|mailto:|tel:)/i.test(v)) return v;
  return `https://${v.replace(/^\/+/, "")}`;
}

/** SNS 입력값(아이디, @아이디, 전체 주소)을 이동할 주소로 바꾼다. */
export function socialUrl(platform: SocialPlatform, raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  if (platform === "email") return v.startsWith("mailto:") ? v : `mailto:${v}`;
  if (platform === "website") return normalizeUrl(v);
  // 전체 주소를 붙여넣은 경우 (예: https://open.kakao.com/o/abc, instagram.com/me)
  if (/^https?:\/\//i.test(v) || /^[\w-]+(\.[\w-]+)+\//.test(v)) return normalizeUrl(v);
  return PLATFORMS[platform].fromId(encodeURIComponent(v.replace(/^@/, "")));
}
