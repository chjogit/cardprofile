"use client";

import { FONTS, THEMES, getTheme } from "@/lib/themes";
import type { Card } from "@/lib/types";

const ACCENTS = ["#2F45FF", "#E5484D", "#F76B15", "#FFC53D", "#30A46C", "#12A594", "#8E4EC6", "#1C1B22"];

function ColorRow({
  label,
  value,
  fallback,
  presets,
  onChange,
}: {
  label: string;
  value: string;
  fallback: string;
  presets?: string[];
  onChange: (v: string) => void;
}) {
  const shown = value || (fallback.startsWith("#") ? fallback : "#ffffff");
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold">{label}</p>
        {value && (
          <button className="text-xs text-cobalt hover:underline" onClick={() => onChange("")}>
            테마 기본값으로
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {presets?.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            aria-label={`색상 ${c}`}
            aria-pressed={value.toLowerCase() === c.toLowerCase()}
            className="h-8 w-8 rounded-full border border-line aria-pressed:ring-2 aria-pressed:ring-cobalt aria-pressed:ring-offset-2"
            style={{ background: c }}
          />
        ))}
        <label className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-xs">
          <input
            type="color"
            value={shown}
            onChange={(e) => onChange(e.target.value)}
            className="h-6 w-6 cursor-pointer rounded-full border-0 bg-transparent p-0"
          />
          직접 고르기
        </label>
      </div>
    </div>
  );
}

export function DesignPanel({ card, onChange }: { card: Card; onChange: (c: Card) => void }) {
  const theme = getTheme(card.themeId);
  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="mb-2 text-sm font-semibold">테마</p>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange({ ...card, themeId: t.id, accent: "", background: "" })}
              aria-pressed={card.themeId === t.id}
              className="overflow-hidden rounded-2xl border-2 border-transparent text-left aria-pressed:border-cobalt"
            >
              <div className="flex h-20 items-center justify-center" style={{ background: t.background }}>
                <div
                  className="flex h-14 w-20 flex-col items-center justify-center gap-1.5"
                  style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10 }}
                >
                  <span className="h-1.5 w-8 rounded-full" style={{ background: t.text, opacity: 0.8 }} />
                  <span className="h-3 w-14 rounded-full" style={{ background: t.accent }} />
                </div>
              </div>
              <p className="bg-surface px-3 py-2 text-sm font-medium">{t.name}</p>
            </button>
          ))}
        </div>
      </div>

      <ColorRow
        label="버튼 색"
        value={card.accent}
        fallback={theme.accent}
        presets={ACCENTS}
        onChange={(accent) => onChange({ ...card, accent })}
      />
      <ColorRow
        label="배경 색"
        value={card.background}
        fallback={theme.background}
        presets={["#F4F4F5", "#FDE7E7", "#E6F0FF", "#FFF4D6", "#1C1B22"]}
        onChange={(background) => onChange({ ...card, background })}
      />

      <div>
        <p className="mb-2 text-sm font-semibold">글꼴</p>
        <div className="flex gap-2">
          {FONTS.map((f) => (
            <button
              key={f.id}
              onClick={() => onChange({ ...card, font: f.id })}
              aria-pressed={card.font === f.id}
              className="flex-1 rounded-xl border border-line bg-surface px-3 py-3 text-base aria-pressed:border-cobalt aria-pressed:bg-cobalt-soft"
              style={{ fontFamily: f.css }}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
