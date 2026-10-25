"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/store";
import type { Block, Design, SocialPlatform } from "@/lib/types";
import { ColorInput, Row, Segmented, Slider, TextStyleEditor, Toggle } from "./controls";
import { PLATFORMS, PLATFORM_ORDER, normalizeUrl, socialUrl } from "@/lib/social";
import { SocialIcon } from "../SocialIcon";

type Props = { block: Block; design: Design; onChange: (b: Block) => void };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-ink-soft">
      {label}
      {children}
    </label>
  );
}

function ResolvedUrl({ url }: { url: string }) {
  if (!url) return null;
  return (
    <p className="truncate text-xs text-ink-soft">
      누르면 <span className="text-cobalt">{url.replace(/^mailto:/, "")}</span> 로 이동해요
    </p>
  );
}

function useUpload(onChange: (v: string) => void, maxSize?: number) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(f, maxSize));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return { busy, error, pick };
}

function AvatarInput({ value, name, onChange }: { value: string; name: string; onChange: (v: string) => void }) {
  const { busy, error, pick } = useUpload(onChange, 600);
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-ink-soft">프로필 사진</p>
      <div className="flex items-center gap-3">
        <label className="group relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-full bg-paper">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-xl font-semibold text-ink-soft">
              {name.trim().charAt(0) || "?"}
            </span>
          )}
          <span className="absolute inset-0 grid place-items-center bg-ink/50 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            바꾸기
          </span>
          <input type="file" accept="image/*" className="sr-only" onChange={pick} aria-label="프로필 사진 올리기" />
        </label>
        <div className="flex flex-wrap gap-2">
          <label className="btn btn-ghost cursor-pointer px-3.5 py-2">
            {busy ? "올리는 중..." : value ? "사진 바꾸기" : "사진 올리기"}
            <input type="file" accept="image/*" className="sr-only" onChange={pick} disabled={busy} />
          </label>
          {value && (
            <button type="button" className="btn btn-ghost px-3.5 py-2" onClick={() => onChange("")}>
              지우기
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600" role="alert">{error}</p>}
    </div>
  );
}

function ImageInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const { busy, error, pick } = useUpload(onChange);
  return (
    <Field label={label}>
      <div className="flex gap-2">
        <input
          className="field"
          placeholder="이미지 주소 붙여넣기"
          value={value.startsWith("data:") ? "업로드한 이미지" : value}
          readOnly={value.startsWith("data:")}
          onChange={(e) => onChange(e.target.value)}
        />
        <label className="btn btn-ghost shrink-0 cursor-pointer px-3">
          {busy ? "올리는 중..." : "올리기"}
          <input type="file" accept="image/*" className="sr-only" onChange={pick} disabled={busy} />
        </label>
        {value && (
          <button type="button" className="btn btn-ghost shrink-0 px-3" onClick={() => onChange("")}>
            지우기
          </button>
        )}
      </div>
      {error && <span className="text-red-600" role="alert">{error}</span>}
    </Field>
  );
}

function BlockContent({ block, onChange }: Omit<Props, "design">) {
  switch (block.type) {
    case "profile":
      return (
        <div className="flex flex-col gap-3">
          <AvatarInput value={block.avatar} name={block.name} onChange={(avatar) => onChange({ ...block, avatar })} />
          <Field label="이름">
            <input className="field" value={block.name} onChange={(e) => onChange({ ...block, name: e.target.value })} />
          </Field>
          <Field label="소개">
            <textarea
              className="field min-h-20"
              value={block.bio}
              onChange={(e) => onChange({ ...block, bio: e.target.value })}
            />
          </Field>
        </div>
      );
    case "text":
      return (
        <Field label="내용">
          <textarea
            className="field min-h-24"
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
          />
        </Field>
      );
    case "link":
      return (
        <div className="flex flex-col gap-3">
          <Field label="버튼 이름">
            <input
              className="field"
              placeholder="예: 포트폴리오 보기"
              value={block.label}
              onChange={(e) => onChange({ ...block, label: e.target.value })}
            />
          </Field>
          <Field label="이동할 주소">
            <input
              className="field"
              inputMode="url"
              placeholder="예: naver.com 또는 https://..."
              value={block.url}
              onChange={(e) => onChange({ ...block, url: e.target.value })}
            />
          </Field>
          <ResolvedUrl url={normalizeUrl(block.url)} />
        </div>
      );
    case "socials":
      return (
        <div className="flex flex-col gap-3">
          {block.items.map((it, i) => {
            const set = (patch: Partial<typeof it>) => {
              const items = [...block.items];
              items[i] = { ...it, ...patch };
              onChange({ ...block, items });
            };
            return (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper text-ink">
                    <SocialIcon platform={it.platform} size={18} />
                  </span>
                  <select
                    className="field w-[7.5rem] shrink-0"
                    aria-label="SNS 종류"
                    value={it.platform}
                    onChange={(e) => set({ platform: e.target.value as SocialPlatform })}
                  >
                    {PLATFORM_ORDER.map((k) => (
                      <option key={k} value={k}>
                        {PLATFORMS[k].name}
                      </option>
                    ))}
                  </select>
                  <input
                    className="field"
                    aria-label={`${PLATFORMS[it.platform].name} ${PLATFORMS[it.platform].placeholder}`}
                    placeholder={PLATFORMS[it.platform].placeholder}
                    value={it.value}
                    onChange={(e) => set({ value: e.target.value })}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost shrink-0 px-3"
                    aria-label="이 아이콘 빼기"
                    onClick={() => onChange({ ...block, items: block.items.filter((_, j) => j !== i) })}
                  >
                    ✕
                  </button>
                </div>
                <div className="pl-11">
                  <ResolvedUrl url={socialUrl(it.platform, it.value)} />
                </div>
              </div>
            );
          })}
          <p className="text-xs text-ink-soft">아이디만 적어도 되고, 전체 주소를 붙여넣어도 돼요.</p>
          <button
            type="button"
            className="btn btn-ghost self-start"
            onClick={() => {
              const used = new Set(block.items.map((x) => x.platform));
              const next = PLATFORM_ORDER.find((k) => !used.has(k)) ?? "website";
              onChange({ ...block, items: [...block.items, { platform: next, value: "" }] });
            }}
          >
            SNS 추가
          </button>
        </div>
      );
    case "image":
      return (
        <div className="flex flex-col gap-3">
          <ImageInput label="이미지" value={block.src} onChange={(src) => onChange({ ...block, src })} />
          <Field label="설명 (화면 낭독기용)">
            <input className="field" value={block.alt} onChange={(e) => onChange({ ...block, alt: e.target.value })} />
          </Field>
        </div>
      );
    case "divider":
      return <p className="text-xs text-ink-soft">블록 사이에 얇은 선을 넣어요.</p>;
  }
}

const SHAPES = [
  { value: "circle" as const, label: "원" },
  { value: "rounded" as const, label: "둥근 네모" },
  { value: "square" as const, label: "네모" },
];

function BlockDesign({ block, design, onChange }: Props) {
  switch (block.type) {
    case "profile":
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2.5 rounded-xl bg-paper p-3">
            <span className="text-xs font-semibold">사진</span>
            <Row label="모양">
              <Segmented
                label="사진 모양"
                value={block.avatarShape ?? "circle"}
                options={SHAPES}
                onChange={(avatarShape) => onChange({ ...block, avatarShape })}
              />
            </Row>
            <Row label="크기">
              <Slider
                label="사진 크기"
                min={56}
                max={160}
                value={block.avatarSize ?? 96}
                unit="px"
                onChange={(avatarSize) => onChange({ ...block, avatarSize })}
              />
            </Row>
          </div>
          <TextStyleEditor
            label="이름 글씨"
            value={block.nameStyle}
            defaultSize={24}
            defaultColor={design.text}
            onChange={(nameStyle) => onChange({ ...block, nameStyle })}
          />
          <TextStyleEditor
            label="소개 글씨"
            value={block.bioStyle}
            defaultSize={15}
            defaultColor={design.muted}
            onChange={(bioStyle) => onChange({ ...block, bioStyle })}
          />
        </div>
      );
    case "text":
      return (
        <TextStyleEditor
          value={block.style}
          defaultSize={15}
          defaultColor={design.text}
          onChange={(style) => onChange({ ...block, style })}
        />
      );
    case "link": {
      const btn = block.button ?? {};
      const variant = btn.variant ?? design.buttonVariant;
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2.5 rounded-xl bg-paper p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">버튼 모양</span>
              {block.button && (
                <button
                  type="button"
                  className="text-xs text-cobalt hover:underline"
                  onClick={() => onChange({ ...block, button: undefined })}
                >
                  처음대로
                </button>
              )}
            </div>
            <Row label="모서리">
              <Segmented
                label="버튼 모서리"
                value={btn.shape ?? design.buttonShape}
                options={[
                  { value: "pill", label: "알약" },
                  { value: "rounded", label: "둥근 네모" },
                  { value: "square", label: "네모" },
                ]}
                onChange={(shape) => onChange({ ...block, button: { ...btn, shape } })}
              />
            </Row>
            <Row label="스타일">
              <Segmented
                label="버튼 스타일"
                value={variant}
                options={[
                  { value: "fill", label: "채우기" },
                  { value: "outline", label: "테두리" },
                  { value: "soft", label: "연하게" },
                ]}
                onChange={(v) => onChange({ ...block, button: { ...btn, variant: v } })}
              />
            </Row>
            <Row label="버튼 색">
              <ColorInput
                label="버튼 색"
                value={btn.bg}
                placeholder={design.accent}
                onChange={(bg) => onChange({ ...block, button: { ...btn, bg } })}
              />
            </Row>
          </div>
          <TextStyleEditor
            label="버튼 글씨"
            value={block.style}
            defaultSize={15}
            defaultColor={variant === "fill" ? design.onAccent : (btn.bg ?? design.accent)}
            onChange={(style) => onChange({ ...block, style })}
          />
        </div>
      );
    }
    case "socials": {
      const ic = block.icon ?? {};
      return (
        <div className="flex flex-col gap-2.5 rounded-xl bg-paper p-3">
          <Row label="모양">
            <Segmented
              label="아이콘 모양"
              value={ic.shape ?? "circle"}
              options={SHAPES}
              onChange={(shape) => onChange({ ...block, icon: { ...ic, shape } })}
            />
          </Row>
          <Row label="크기">
            <Slider
              label="아이콘 크기"
              min={32}
              max={64}
              value={ic.size ?? 44}
              unit="px"
              onChange={(size) => onChange({ ...block, icon: { ...ic, size } })}
            />
          </Row>
          <Row label="색">
            <ColorInput
              label="아이콘 색"
              value={ic.color}
              placeholder={design.text}
              onChange={(color) => onChange({ ...block, icon: { ...ic, color } })}
            />
          </Row>
          <Row label="배경 채우기">
            <Toggle
              label="아이콘 배경 채우기"
              checked={Boolean(ic.filled)}
              onChange={(filled) => onChange({ ...block, icon: { ...ic, filled } })}
            />
          </Row>
        </div>
      );
    }
    case "image":
      return (
        <div className="rounded-xl bg-paper p-3">
          <Row label="모서리 둥글기">
            <Slider
              label="이미지 모서리"
              min={0}
              max={40}
              value={block.radius ?? 12}
              unit="px"
              onChange={(radius) => onChange({ ...block, radius })}
            />
          </Row>
        </div>
      );
    case "divider":
      return (
        <div className="rounded-xl bg-paper p-3">
          <Row label="선 색">
            <ColorInput
              label="선 색"
              value={block.color}
              placeholder={design.muted}
              onChange={(color) => onChange({ ...block, color })}
            />
          </Row>
        </div>
      );
  }
}

export function BlockEditor(props: Props) {
  const [view, setView] = useState<"content" | "design">("content");
  return (
    <div className="flex flex-col gap-3">
      {props.block.type !== "divider" && (
        <Segmented
          fill
          label="편집할 내용"
          value={view}
          onChange={setView}
          options={[
            { value: "content", label: "내용" },
            { value: "design", label: "꾸미기" },
          ]}
        />
      )}
      {view === "content" && props.block.type !== "divider" ? (
        <BlockContent block={props.block} onChange={props.onChange} />
      ) : (
        <BlockDesign {...props} />
      )}
    </div>
  );
}
