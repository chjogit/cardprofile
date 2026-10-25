"use client";

import { useEffect, useRef, useState } from "react";
import { FontLoader } from "@/components/FontLoader";
import { FONTS, FONT_LANGS, fontStack, getFontDef, type FontLang } from "@/lib/fonts";
import type { TextStyle } from "@/lib/types";

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="shrink-0 text-xs font-medium text-ink-soft">{label}</span>
      <div className="flex min-w-0 items-center gap-2">{children}</div>
    </div>
  );
}

/** 색 고르기. value가 비어 있으면 placeholder 색을 보여주고 "기본" 상태로 둔다. */
export function ColorInput({
  value,
  placeholder,
  onChange,
  label,
}: {
  value?: string;
  placeholder: string;
  onChange: (v: string | undefined) => void;
  label: string;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <label className="relative h-7 w-7 shrink-0 cursor-pointer overflow-hidden rounded-full border border-line">
        <span className="absolute inset-0" style={{ background: value ?? placeholder }} />
        <input
          type="color"
          aria-label={label}
          value={value ?? (placeholder.startsWith("#") ? placeholder : "#000000")}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
      {value !== undefined && (
        <button type="button" className="text-xs text-cobalt hover:underline" onClick={() => onChange(undefined)}>
          기본
        </button>
      )}
    </span>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  fill,
}: {
  value: T;
  options: { value: T; label: React.ReactNode; title?: string }[];
  onChange: (v: T) => void;
  label: string;
  // true면 가로폭을 가득 채우고 버튼을 같은 너비로 나눈다
  fill?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`rounded-lg border border-line bg-surface p-0.5 ${fill ? "grid grid-flow-col auto-cols-fr" : "flex"}`}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          title={o.title}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className="min-w-8 rounded-md px-2 py-1 text-center text-xs text-ink-soft aria-pressed:bg-ink aria-pressed:text-white"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <span className="flex items-center gap-2">
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-28 accent-[var(--cobalt)]"
      />
      <span className="w-10 text-right text-xs tabular-nums text-ink-soft">
        {value}
        {unit}
      </span>
    </span>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative h-6 w-10 rounded-full bg-line transition-colors aria-checked:bg-cobalt"
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left] ${checked ? "left-[18px]" : "left-0.5"}`}
      />
    </button>
  );
}

const PREVIEW_TEXT =
  FONTS.map((f) => f.name).join("") + FONT_LANGS.map((l) => l.sample).join("") + "기본글꼴";

/** 언어별 20개 글꼴 중에서 고르기 */
export function FontPicker({
  value,
  onChange,
  allowDefault,
}: {
  value?: string;
  onChange: (id: string | undefined) => void;
  allowDefault?: boolean;
}) {
  const current = getFontDef(value);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<FontLang>(current?.lang ?? "ko");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const sample = FONT_LANGS.find((l) => l.id === lang)!.sample;

  return (
    <div ref={ref} className="relative">
      {/* 미리보기용으로 글꼴 이름과 예시 글자만 담긴 작은 파일을 받는다 */}
      <FontLoader defs={FONTS.filter((f) => f.source === "google")} text={PREVIEW_TEXT} />
      {open && <FontLoader defs={FONTS.filter((f) => f.source === "noonnu")} />}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="field flex w-40 items-center justify-between gap-2 text-left"
        style={{ fontFamily: fontStack(value) }}
      >
        <span className="truncate">{current?.name ?? "기본 글꼴"}</span>
        <span aria-hidden="true" className="text-ink-soft">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-1 w-72 overflow-hidden rounded-xl border border-line bg-surface shadow-xl">
          <div className="flex border-b border-line">
            {FONT_LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={lang === l.id}
                onClick={() => setLang(l.id)}
                className="flex-1 py-2 text-sm text-ink-soft aria-pressed:font-semibold aria-pressed:text-cobalt aria-pressed:shadow-[inset_0_-2px_0_var(--cobalt)]"
              >
                {l.name}
              </button>
            ))}
          </div>
          <ul className="max-h-80 overflow-y-auto py-1" role="listbox" aria-label="글꼴">
            {allowDefault && (
              <li>
                <button
                  type="button"
                  role="option"
                  aria-selected={!value}
                  onClick={() => {
                    onChange(undefined);
                    setOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-paper aria-selected:bg-cobalt-soft"
                >
                  카드 기본 글꼴 따르기
                </button>
              </li>
            )}
            {FONTS.filter((f) => f.lang === lang).map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === f.id}
                  onClick={() => {
                    onChange(f.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-baseline justify-between gap-2 px-3 py-2 text-left hover:bg-paper aria-selected:bg-cobalt-soft"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[15px]" style={{ fontFamily: fontStack(f.id) }}>
                      {f.name}
                    </span>
                    <span className="block truncate text-xs text-ink-soft" style={{ fontFamily: fontStack(f.id) }}>
                      {sample}
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] text-ink-soft">{f.source === "noonnu" ? "눈누" : "Google"}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** 글씨 꾸미기: 글꼴, 크기, 색, 굵게/기울임/밑줄, 정렬 */
export function TextStyleEditor({
  value = {},
  onChange,
  defaultSize,
  defaultColor,
  label = "글씨",
}: {
  value?: TextStyle;
  onChange: (s: TextStyle) => void;
  defaultSize: number;
  defaultColor: string;
  label?: string;
}) {
  const set = (patch: Partial<TextStyle>) => onChange({ ...value, ...patch });
  const size = value.size ?? defaultSize;
  const toggles: { key: "bold" | "italic" | "underline"; label: React.ReactNode; title: string }[] = [
    { key: "bold", label: <b>B</b>, title: "굵게" },
    { key: "italic", label: <i className="font-serif">I</i>, title: "기울임" },
    { key: "underline", label: <u>U</u>, title: "밑줄" },
  ];
  const isEmpty = Object.values(value).every((v) => v === undefined);
  return (
    <div className="flex flex-col gap-2.5 rounded-xl bg-paper p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">{label}</span>
        {!isEmpty && (
          <button type="button" className="text-xs text-cobalt hover:underline" onClick={() => onChange({})}>
            처음대로
          </button>
        )}
      </div>
      <Row label="글꼴">
        <FontPicker value={value.font} onChange={(font) => set({ font })} allowDefault />
      </Row>
      <Row label="크기">
        <span className="flex items-center gap-1">
          <button
            type="button"
            aria-label="글씨 작게"
            className="h-7 w-7 rounded-md border border-line bg-surface"
            onClick={() => set({ size: Math.max(10, size - 1) })}
          >
            −
          </button>
          <input
            type="number"
            aria-label="글씨 크기"
            min={10}
            max={64}
            value={size}
            onChange={(e) => set({ size: Math.min(64, Math.max(10, Number(e.target.value) || defaultSize)) })}
            className="h-7 w-12 rounded-md border border-line bg-surface text-center text-sm tabular-nums"
          />
          <button
            type="button"
            aria-label="글씨 크게"
            className="h-7 w-7 rounded-md border border-line bg-surface"
            onClick={() => set({ size: Math.min(64, size + 1) })}
          >
            +
          </button>
        </span>
      </Row>
      <Row label="꾸미기">
        <div role="group" aria-label="글씨 꾸미기" className="flex gap-1">
          {toggles.map((t) => (
            <button
              key={t.key}
              type="button"
              title={t.title}
              aria-label={t.title}
              aria-pressed={Boolean(value[t.key])}
              onClick={() => set({ [t.key]: !value[t.key] })}
              className="h-7 w-8 rounded-md border border-line bg-surface text-sm aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white"
            >
              {t.label}
            </button>
          ))}
        </div>
        <ColorInput label="글씨 색" value={value.color} placeholder={defaultColor} onChange={(color) => set({ color })} />
      </Row>
      <Row label="정렬">
        <Segmented
          label="정렬"
          value={value.align ?? "center"}
          onChange={(align) => set({ align })}
          options={[
            { value: "left", label: "왼쪽" },
            { value: "center", label: "가운데" },
            { value: "right", label: "오른쪽" },
          ]}
        />
      </Row>
    </div>
  );
}
