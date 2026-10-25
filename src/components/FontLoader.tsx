import { getFontDef, googleCssUrl, noonnuFontFaces, type FontDef } from "@/lib/fonts";

/** 카드에 쓰인 글꼴만 불러온다. text를 주면 그 글자만 담긴 작은 파일을 받는다(미리보기용). */
export function FontLoader({ ids, defs, text }: { ids?: string[]; defs?: FontDef[]; text?: string }) {
  const fonts = defs ?? [...new Set(ids)].map(getFontDef).filter((f): f is FontDef => Boolean(f));
  const href = googleCssUrl(fonts, text);
  const faces = noonnuFontFaces(fonts);
  return (
    <>
      {href && <link rel="stylesheet" href={href} precedence="default" />}
      {faces && <style href={`noonnu-${fonts.map((f) => f.id).join("-")}`} precedence="default">{faces}</style>}
    </>
  );
}
