"use client";

import { fileToDataUrl } from "@/lib/image";
import type { Block, SocialPlatform } from "@/lib/types";
import { SOCIAL_NAMES } from "../SocialIcon";

type Props = { block: Block; onChange: (b: Block) => void };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-ink-soft">
      {label}
      {children}
    </label>
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
          <Field label="버튼 글자">
            <input className="field" value={block.label} onChange={(e) => onChange({ ...block, label: e.target.value })} />
          </Field>
          <Field label="연결할 주소">
            <input
              className="field"
              type="url"
              value={block.url}
              onChange={(e) => onChange({ ...block, url: e.target.value })}
            />
          </Field>
        </div>
      );
    case "socials":
      return (
        <div className="flex flex-col gap-2">
          {block.items.map((it, i) => (
            <div key={i} className="flex gap-2">
              <select
                className="field w-32 shrink-0"
                aria-label="서비스"
                value={it.platform}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...it, platform: e.target.value as SocialPlatform };
                  onChange({ ...block, items });
                }}
              >
                {Object.entries(SOCIAL_NAMES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <input
                className="field"
                aria-label="주소"
                placeholder={it.platform === "email" ? "me@example.com" : "https://"}
                value={it.url}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = { ...it, url: e.target.value };
                  onChange({ ...block, items });
                }}
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
          ))}
          <button
            type="button"
            className="btn btn-ghost self-start"
            onClick={() => onChange({ ...block, items: [...block.items, { platform: "website", url: "https://" }] })}
          >
            아이콘 추가
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
