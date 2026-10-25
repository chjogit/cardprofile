"use client";

import { fileToDataUrl } from "@/lib/image";
import type { Block, SocialPlatform } from "@/lib/types";
import { PLATFORMS, PLATFORM_ORDER, normalizeUrl, socialUrl } from "@/lib/social";
import { SocialIcon } from "../SocialIcon";

type Props = { block: Block; onChange: (b: Block) => void };

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

function ImageInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
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
          올리기
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) onChange(await fileToDataUrl(f));
              e.target.value = "";
            }}
          />
        </label>
        {value && (
          <button type="button" className="btn btn-ghost shrink-0 px-3" onClick={() => onChange("")}>
            지우기
          </button>
        )}
      </div>
    </Field>
  );
}

export function BlockEditor({ block, onChange }: Props) {
  switch (block.type) {
    case "profile":
      return (
        <div className="flex flex-col gap-3">
          <ImageInput label="프로필 사진" value={block.avatar} onChange={(avatar) => onChange({ ...block, avatar })} />
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
