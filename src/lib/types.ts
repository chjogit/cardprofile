export type SocialPlatform =
  | "instagram"
  | "youtube"
  | "kakao"
  | "naverblog"
  | "threads"
  | "tiktok"
  | "x"
  | "facebook"
  | "github"
  | "linkedin"
  | "email"
  | "website";

export type Block =
  | { id: string; type: "profile"; name: string; bio: string; avatar: string }
  | { id: string; type: "text"; text: string }
  | { id: string; type: "link"; label: string; url: string }
  | { id: string; type: "socials"; items: { platform: SocialPlatform; value: string }[] }
  | { id: string; type: "image"; src: string; alt: string }
  | { id: string; type: "divider" };

export type BlockType = Block["type"];

export type FontId = "sans" | "serif" | "round";

export type Card = {
  themeId: string;
  accent: string;
  background: string;
  font: FontId;
  blocks: Block[];
};

export type Profile = {
  id: string;
  username: string;
  card: Card;
  published: boolean;
  updatedAt: string;
};
