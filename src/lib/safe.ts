// 카드 데이터는 브라우저가 만든 JSON을 그대로 저장하므로, API로 직접 쓴 값이 섞여 있을 수 있다.
// 화면에 그리기 전에 색상·숫자·이미지 주소를 걸러 낸다.

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export const isHexColor = (v: unknown): v is string => typeof v === "string" && HEX_RE.test(v);

const supabaseOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : "";
  } catch {
    return "";
  }
})();

/** 내 Supabase Storage 주소 또는 앱이 만든 data:image 주소만 허용한다. 그 밖은 빈 문자열. */
export function safeImageSrc(v: unknown): string {
  if (typeof v !== "string" || !v) return "";
  if (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v)) return v;
  if (supabaseOrigin && v.startsWith(`${supabaseOrigin}/storage/v1/object/public/images/`)) return v;
  return "";
}

/** 블록 안의 모든 color / bg 값 중 #RRGGBB가 아닌 것을 지운다. */
export function stripBadColors<T>(value: T): T {
  if (Array.isArray(value)) return value.map(stripBadColors) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if ((k === "color" || k === "bg") && !isHexColor(v)) continue;
      out[k] = stripBadColors(v);
    }
    return out as T;
  }
  return value;
}
