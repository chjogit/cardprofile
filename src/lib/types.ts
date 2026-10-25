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

/** 블록 하나의 글씨 꾸미기. 비어 있는 값은 카드 전체 설정을 따른다. */
export type TextStyle = {
  font?: string;
  size?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: "left" | "center" | "right";
};

export type ButtonShape = "pill" | "rounded" | "square";
export type ButtonVariant = "fill" | "outline" | "soft";

export type ButtonStyle = {
  shape?: ButtonShape;
  variant?: ButtonVariant;
  bg?: string;
  color?: string;
};

export type IconShape = "circle" | "rounded" | "square";

export type IconStyle = {
  shape?: IconShape;
  size?: number;
  color?: string;
  filled?: boolean;
};

export type Block =
  | {
      id: string;
      type: "profile";
      name: string;
      bio: string;
      avatar: string;
      avatarShape?: IconShape;
      avatarSize?: number;
      nameStyle?: TextStyle;
      bioStyle?: TextStyle;
    }
  | { id: string; type: "text"; text: string; style?: TextStyle }
  | { id: string; type: "link"; label: string; url: string; style?: TextStyle; button?: ButtonStyle }
  | {
      id: string;
      type: "socials";
      items: { platform: SocialPlatform; value: string }[];
      icon?: IconStyle;
    }
  | { id: string; type: "image"; src: string; alt: string; radius?: number }
  | { id: string; type: "divider"; color?: string };

export type BlockType = Block["type"];

/** 카드 전체 디자인. 프리셋을 고르면 값이 채워지고, 이후 하나씩 바꿀 수 있다. */
export type Design = {
  bgType: "solid" | "gradient";
  bg1: string;
  bg2: string;
  bgAngle: number;
  cardBg: string;
  cardOpacity: number;
  cardBorder: string;
  borderWidth: number;
  radius: number;
  blur: boolean;
  shadow: boolean;
  text: string;
  muted: string;
  accent: string;
  onAccent: string;
  font: string;
  buttonShape: ButtonShape;
  buttonVariant: ButtonVariant;
};

export type Card = {
  preset: string;
  design: Design;
  blocks: Block[];
};

export type Profile = {
  id: string;
  username: string;
  card: Card;
  published: boolean;
  updatedAt: string;
};
