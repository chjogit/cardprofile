"use client";

import { PRESETS, backgroundCss, getPreset, hexToRgba } from "@/lib/themes";
import type { Card, Design } from "@/lib/types";
import { ColorInput, FontPicker, Row, Section, Segmented, Slider, Toggle } from "./controls";

export function DesignPanel({ card, onChange }: { card: Card; onChange: (c: Card) => void }) {
  const d = card.design;
  const set = (patch: Partial<Design>) => onChange({ ...card, design: { ...d, ...patch } });
  const preset = getPreset(card.preset);
  const edited = JSON.stringify(preset.design) !== JSON.stringify(d);
  // ColorInput은 값을 지우면 undefined를 주므로, 카드 전체 설정에서는 프리셋 값으로 되돌린다.
  const color = (key: keyof Design) => (v: string | undefined) => set({ [key]: v ?? preset.design[key] });
  // 프리셋과 다를 때만 "기본" 버튼이 보이도록 값을 넘긴다.
  const changed = (key: keyof Design) => (d[key] === preset.design[key] ? undefined : (d[key] as string));

  return (
    <div className="flex flex-col gap-7">
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <p className="text-sm font-semibold">프리셋</p>
          {edited && (
            <button
              className="text-xs text-cobalt hover:underline"
              onClick={() => onChange({ ...card, design: { ...preset.design } })}
            >
              {preset.name} 프리셋으로 되돌리기
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => onChange({ ...card, preset: p.id, design: { ...p.design } })}
              aria-pressed={card.preset === p.id}
              className="overflow-hidden rounded-xl border-2 border-transparent text-left aria-pressed:border-cobalt"
            >
              <div className="flex h-16 items-center justify-center" style={{ background: backgroundCss(p.design) }}>
                <div
                  className="flex h-11 w-14 flex-col items-center justify-center gap-1"
                  style={{
                    background: hexToRgba(p.design.cardBg, p.design.cardOpacity),
                    border: `1px solid ${p.design.cardBorder}`,
                    borderRadius: Math.min(p.design.radius, 10),
                  }}
                >
                  <span className="h-1 w-6 rounded-full" style={{ background: p.design.text, opacity: 0.8 }} />
                  <span
                    className="h-2.5 w-10"
                    style={{
                      background: p.design.buttonVariant === "outline" ? "transparent" : p.design.accent,
                      border: `1.5px solid ${p.design.accent}`,
                      borderRadius: p.design.buttonShape === "square" ? 0 : 99,
                    }}
                  />
                </div>
              </div>
              <p className="bg-surface px-2.5 py-1.5 text-xs font-medium">
                {p.name}
                {card.preset === p.id && edited && <span className="text-ink-soft"> · 수정함</span>}
              </p>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-soft">프리셋을 고른 뒤에도 아래에서 하나씩 바꿀 수 있어요.</p>
      </div>

      <Section title="배경">
        <Row label="종류">
          <Segmented
            label="배경 종류"
            value={d.bgType}
            onChange={(bgType) => set({ bgType })}
            options={[
              { value: "solid", label: "단색" },
              { value: "gradient", label: "그라디언트" },
            ]}
          />
        </Row>
        <Row label={d.bgType === "gradient" ? "시작 색 / 끝 색" : "색"}>
          <ColorInput label="배경 색" value={changed("bg1")} placeholder={d.bg1} onChange={color("bg1")} />
          {d.bgType === "gradient" && (
            <ColorInput label="배경 끝 색" value={changed("bg2")} placeholder={d.bg2} onChange={color("bg2")} />
          )}
        </Row>
        {d.bgType === "gradient" && (
          <Row label="방향">
            <Slider label="그라디언트 방향" min={0} max={360} step={5} unit="°" value={d.bgAngle} onChange={(bgAngle) => set({ bgAngle })} />
          </Row>
        )}
      </Section>

      <Section title="카드">
        <Row label="색">
          <ColorInput label="카드 색" value={changed("cardBg")} placeholder={d.cardBg} onChange={color("cardBg")} />
        </Row>
        <Row label="불투명도">
          <Slider label="카드 불투명도" min={0} max={100} unit="%" value={d.cardOpacity} onChange={(cardOpacity) => set({ cardOpacity })} />
        </Row>
        <Row label="모서리 둥글기">
          <Slider label="카드 모서리" min={0} max={40} unit="px" value={d.radius} onChange={(radius) => set({ radius })} />
        </Row>
        <Row label="테두리">
          <ColorInput label="테두리 색" value={changed("cardBorder")} placeholder={d.cardBorder} onChange={color("cardBorder")} />
          <Slider label="테두리 두께" min={0} max={4} unit="px" value={d.borderWidth} onChange={(borderWidth) => set({ borderWidth })} />
        </Row>
        <Row label="그림자">
          <Toggle label="카드 그림자" checked={d.shadow} onChange={(shadow) => set({ shadow })} />
        </Row>
        <Row label="뒤 배경 흐리게">
          <Toggle label="뒤 배경 흐리게" checked={d.blur} onChange={(blur) => set({ blur })} />
        </Row>
      </Section>

      <Section title="글씨">
        <Row label="기본 글꼴">
          <FontPicker value={d.font} onChange={(font) => font && set({ font })} />
        </Row>
        <Row label="글씨 색 / 보조 글씨 색">
          <ColorInput label="글씨 색" value={changed("text")} placeholder={d.text} onChange={color("text")} />
          <ColorInput label="보조 글씨 색" value={changed("muted")} placeholder={d.muted} onChange={color("muted")} />
        </Row>
      </Section>

      <Section title="버튼 기본값">
        <Row label="버튼 색 / 글씨 색">
          <ColorInput label="버튼 색" value={changed("accent")} placeholder={d.accent} onChange={color("accent")} />
          <ColorInput label="버튼 글씨 색" value={changed("onAccent")} placeholder={d.onAccent} onChange={color("onAccent")} />
        </Row>
        <Row label="모서리">
          <Segmented
            label="버튼 모서리"
            value={d.buttonShape}
            onChange={(buttonShape) => set({ buttonShape })}
            options={[
              { value: "pill", label: "알약" },
              { value: "rounded", label: "둥근 네모" },
              { value: "square", label: "네모" },
            ]}
          />
        </Row>
        <Row label="스타일">
          <Segmented
            label="버튼 스타일"
            value={d.buttonVariant}
            onChange={(buttonVariant) => set({ buttonVariant })}
            options={[
              { value: "fill", label: "채우기" },
              { value: "outline", label: "테두리" },
              { value: "soft", label: "연하게" },
            ]}
          />
        </Row>
        <p className="text-xs text-ink-soft">버튼마다 다르게 하려면 블록 탭에서 버튼을 열고 꾸미기를 누르세요.</p>
      </Section>
    </div>
  );
}
