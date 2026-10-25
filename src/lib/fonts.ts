// 카드에 쓸 수 있는 글꼴 목록. 한국어는 눈누(noonnu.cc) 10개 + Google Fonts 10개,
// 영어와 일본어는 Google Fonts에서 20개씩 골랐다. (눈누는 한글 폰트만 제공한다.)

export type FontLang = "ko" | "en" | "ja";

export type FontDef = {
  id: string;
  name: string;
  family: string;
  lang: FontLang;
  source: "noonnu" | "google";
  fallback: "sans-serif" | "serif" | "cursive" | "monospace";
  // 눈누: @font-face로 불러올 파일
  faces?: { url: string; weight: number }[];
  // Google Fonts: 불러올 굵기 (없으면 400만)
  weights?: number[];
};

const CDN = "https://cdn.jsdelivr.net/gh/projectnoonnu";

const NOONNU: FontDef[] = (
  [
  {
    id: "pretendard",
    name: "프리텐다드",
    family: "Pretendard",
    faces: [
      { url: `${CDN}/pretendard@1.0/Pretendard-Regular.woff2`, weight: 400 },
      { url: `${CDN}/pretendard@1.0/Pretendard-Bold.woff2`, weight: 700 },
    ],
  },
  {
    id: "suit",
    name: "수트",
    family: "Suit",
    faces: [
      { url: `${CDN}/noonfonts_suit@1.0/SUIT-Regular.woff2`, weight: 400 },
      { url: `${CDN}/noonfonts_suit@1.0/SUIT-Bold.woff2`, weight: 700 },
    ],
  },
  {
    id: "paperlogy",
    name: "페이퍼로지",
    family: "Paperozi",
    faces: [
      { url: `${CDN}/2408-3@1.0/Paperlogy-4Regular.woff2`, weight: 400 },
      { url: `${CDN}/2408-3@1.0/Paperlogy-7Bold.woff2`, weight: 700 },
    ],
  },
  {
    id: "freesentation",
    name: "프리젠테이션",
    family: "Presentation",
    faces: [
      { url: `${CDN}/2404@1.0/Freesentation-4Regular.woff2`, weight: 400 },
      { url: `${CDN}/2404@1.0/Freesentation-7Bold.woff2`, weight: 700 },
    ],
  },
  {
    id: "gmarket-sans",
    name: "G마켓 산스",
    family: "GMarketSans",
    faces: [
      { url: `${CDN}/noonfonts_2001@1.1/GmarketSansMedium.woff`, weight: 400 },
      { url: `${CDN}/noonfonts_2001@1.1/GmarketSansBold.woff`, weight: 700 },
    ],
  },
  {
    id: "maruburi",
    name: "마루 부리",
    family: "MaruBuri",
    fallback: "serif",
    faces: [
      { url: "https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-Regular.woff2", weight: 400 },
      { url: "https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-Bold.woff2", weight: 700 },
    ],
  },
  {
    id: "jalnan",
    name: "여기어때 잘난체",
    family: "YeogiOttaeJalnan",
    faces: [{ url: `${CDN}/noonfonts_four@1.2/JalnanOTF00.woff`, weight: 400 }],
  },
  {
    id: "cafe24-surround",
    name: "카페24 써라운드",
    family: "Cafe24Surround",
    faces: [{ url: `${CDN}/noonfonts_2105_2@1.0/Cafe24Ssurround.woff`, weight: 400 }],
  },
  {
    id: "aggro",
    name: "어그로체",
    family: "Aggravo",
    faces: [
      { url: `${CDN}/noonfonts_2108@1.1/SBAggroM.woff`, weight: 400 },
      { url: `${CDN}/noonfonts_2108@1.1/SBAggroB.woff`, weight: 700 },
    ],
  },
  {
    id: "ongleip-parkdahyeon",
    name: "온글잎 박다현체",
    family: "OngleipParkDahyeon",
    fallback: "cursive",
    faces: [{ url: `${CDN}/2411-3@1.0/Ownglyph_ParkDaHyun.woff2`, weight: 400 }],
  },
  ] as Omit<FontDef, "lang" | "source" | "fallback">[] & { fallback?: FontDef["fallback"] }[]
).map((f) => ({ fallback: "sans-serif" as const, ...f, lang: "ko" as const, source: "noonnu" as const }));

type G = [name: string, family: string, weights?: number[], fallback?: FontDef["fallback"]];

const B = [400, 700];

const GOOGLE_KO: G[] = [
  ["IBM Plex Sans KR", "IBM Plex Sans KR", B],
  ["Noto Sans KR", "Noto Sans KR", B],
  ["Noto Serif KR", "Noto Serif KR", B, "serif"],
  ["나눔고딕", "Nanum Gothic", B],
  ["나눔명조", "Nanum Myeongjo", B, "serif"],
  ["고운돋움", "Gowun Dodum"],
  ["고운바탕", "Gowun Batang", B, "serif"],
  ["주아", "Jua"],
  ["도현", "Do Hyeon"],
  ["나눔펜", "Nanum Pen Script", undefined, "cursive"],
];

const GOOGLE_EN: G[] = [
  ["Inter", "Inter", B],
  ["Poppins", "Poppins", B],
  ["Montserrat", "Montserrat", B],
  ["DM Sans", "DM Sans", B],
  ["Space Grotesk", "Space Grotesk", B],
  ["Outfit", "Outfit", B],
  ["Josefin Sans", "Josefin Sans", B],
  ["Syne", "Syne", B],
  ["Playfair Display", "Playfair Display", B, "serif"],
  ["Lora", "Lora", B, "serif"],
  ["Fraunces", "Fraunces", B, "serif"],
  ["DM Serif Display", "DM Serif Display", undefined, "serif"],
  ["Roboto Slab", "Roboto Slab", B, "serif"],
  ["Oswald", "Oswald", B],
  ["Bebas Neue", "Bebas Neue"],
  ["Archivo Black", "Archivo Black"],
  ["Righteous", "Righteous"],
  ["Pacifico", "Pacifico", undefined, "cursive"],
  ["Caveat", "Caveat", B, "cursive"],
  ["Dancing Script", "Dancing Script", B, "cursive"],
];

const GOOGLE_JA: G[] = [
  ["Noto Sans JP", "Noto Sans JP", B],
  ["Noto Serif JP", "Noto Serif JP", B, "serif"],
  ["M PLUS 1p", "M PLUS 1p", B],
  ["M PLUS Rounded 1c", "M PLUS Rounded 1c", B],
  ["Zen Kaku Gothic New", "Zen Kaku Gothic New", B],
  ["Zen Maru Gothic", "Zen Maru Gothic", B],
  ["Zen Old Mincho", "Zen Old Mincho", B, "serif"],
  ["Shippori Mincho", "Shippori Mincho", B, "serif"],
  ["Sawarabi Gothic", "Sawarabi Gothic"],
  ["Sawarabi Mincho", "Sawarabi Mincho", undefined, "serif"],
  ["Kosugi Maru", "Kosugi Maru"],
  ["BIZ UDPGothic", "BIZ UDPGothic", B],
  ["Kiwi Maru", "Kiwi Maru"],
  ["Klee One", "Klee One", undefined, "cursive"],
  ["Yomogi", "Yomogi", undefined, "cursive"],
  ["Hachi Maru Pop", "Hachi Maru Pop", undefined, "cursive"],
  ["Yusei Magic", "Yusei Magic"],
  ["Dela Gothic One", "Dela Gothic One"],
  ["RocknRoll One", "RocknRoll One"],
  ["DotGothic16", "DotGothic16", undefined, "monospace"],
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function google(list: G[], lang: FontLang): FontDef[] {
  return list.map(([name, family, weights, fallback]) => ({
    id: `g-${slug(family)}`,
    name,
    family,
    lang,
    source: "google",
    fallback: fallback ?? "sans-serif",
    weights,
  }));
}

export const FONTS: FontDef[] = [
  ...NOONNU,
  ...google(GOOGLE_KO, "ko"),
  ...google(GOOGLE_EN, "en"),
  ...google(GOOGLE_JA, "ja"),
];

export const DEFAULT_FONT = "g-ibm-plex-sans-kr";

export const FONT_LANGS: { id: FontLang; name: string; sample: string }[] = [
  { id: "ko", name: "한국어", sample: "다람쥐 헌 쳇바퀴" },
  { id: "en", name: "English", sample: "Hello, nice to meet you" },
  { id: "ja", name: "日本語", sample: "はじめまして" },
];

const byId = new Map(FONTS.map((f) => [f.id, f]));

export function getFontDef(id?: string): FontDef | undefined {
  return id ? byId.get(id) : undefined;
}

export function fontStack(id?: string): string | undefined {
  const f = getFontDef(id);
  if (!f) return undefined;
  // 한글이 없는 영어/일본어 폰트를 골라도 한글은 기본 고딕으로 보이게 한다.
  return `'${f.family}', 'IBM Plex Sans KR', ${f.fallback}`;
}

export function googleCssUrl(fonts: FontDef[], text?: string): string | null {
  const g = fonts.filter((f) => f.source === "google");
  if (g.length === 0) return null;
  const families = g
    .map((f) => {
      const fam = `family=${encodeURIComponent(f.family).replace(/%20/g, "+")}`;
      return f.weights ? `${fam}:wght@${f.weights.join(";")}` : fam;
    })
    .join("&");
  const t = text ? `&text=${encodeURIComponent(text)}` : "";
  return `https://fonts.googleapis.com/css2?${families}${t}&display=swap`;
}

export function noonnuFontFaces(fonts: FontDef[]): string {
  return fonts
    .filter((f) => f.faces)
    .flatMap((f) =>
      f.faces!.map(
        (face) =>
          `@font-face{font-family:'${f.family}';src:url('${face.url}');font-weight:${face.weight};font-display:swap}`,
      ),
    )
    .join("\n");
}
