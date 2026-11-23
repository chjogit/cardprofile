// Lucian UX/UI Prompt #436 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#436
"use client";

import { useEffect, useId, useRef, useState } from "react";

// 되돌릴 수 없는 삭제 앞에서 한 번 더 묻는 확인 창.
// 삭제를 누르면 휴지통 뚜껑이 열리고 문서가 들어간 뒤 닫힌다. 실제 삭제는 애니메이션과 함께 진행된다.
export function ConfirmDelete({
  title,
  description,
  confirmLabel = "삭제",
  onConfirm,
  onClose,
}: {
  title: string;
  description: string;
  confirmLabel?: string;
  /** 실제 삭제. 성공하면 resolve, 실패하면 reject. */
  onConfirm: () => Promise<void>;
  /** 창이 사라진 뒤 불린다. 삭제했으면 done, 실패했으면 error, 취소했으면 빈 값. */
  onClose: (result: { done?: boolean; error?: Error }) => void;
}) {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const okRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<"pre" | "open" | "del" | "gone">("pre");
  const [live, setLive] = useState("");
  const busy = phase === "del" || phase === "gone";
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  const rm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const ts = timers.current;
    const prev = document.activeElement as HTMLElement | null;
    // 다음 프레임에 is-pre를 빼서 창이 튀어나오게 한다
    const raf = requestAnimationFrame(() => setPhase("open"));
    noRef.current?.focus({ preventScroll: true });
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      ts.forEach(clearTimeout);
      document.body.style.overflow = overflow;
      prev?.focus?.({ preventScroll: true });
    };
  }, []);

  function close(result: { done?: boolean; error?: Error } = {}) {
    setPhase("gone");
    later(() => onClose(result), rm() ? 0 : 320);
  }

  function cancel() {
    if (busy) return;
    close();
  }

  async function confirm() {
    if (busy) return;
    setPhase("del");
    const anim = new Promise<void>((r) => later(r, rm() ? 200 : 1350));
    try {
      await Promise.all([onConfirm(), anim]);
      setLive("삭제했어요");
      close({ done: true });
    } catch (e) {
      await anim;
      close({ error: e as Error });
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      cancel();
      return;
    }
    // 창 안에서만 Tab이 돈다
    if (e.key === "Tab") {
      const a = document.activeElement;
      if (e.shiftKey && a === noRef.current) {
        e.preventDefault();
        okRef.current?.focus({ preventScroll: true });
      } else if (!e.shiftKey && a === okRef.current) {
        e.preventDefault();
        noRef.current?.focus({ preventScroll: true });
      }
    }
  }

  const cls = phase === "pre" ? " is-pre" : phase === "del" ? " is-del" : phase === "gone" ? " is-gone is-del" : "";
  const dis = busy ? { "aria-disabled": true as const } : {};

  return (
    <div
      ref={rootRef}
      className={`ux u436${cls}`}
      onKeyDown={onKeyDown}
      onMouseDown={(e) => {
        if (e.target === rootRef.current) cancel();
      }}
    >
      <div
        className="u436-d"
        role="alertdialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby={`${uid}t`}
        aria-describedby={`${uid}p`}
      >
        <div className="u436-ic" aria-hidden="true">
          <svg viewBox="0 0 32 32">
            <defs>
              <clipPath id={`${uid}c`}>
                <rect x="-10" y="-30" width="52" height="40.5" />
              </clipPath>
            </defs>
            <g clipPath={`url(#${uid}c)`}>
              <g className="doc">
                <path d="M12.5 -1.5h5l3 3v8h-8z" />
                <path d="M14.5 3.5h3.5M14.5 6h3.5" strokeWidth="1.2" />
              </g>
            </g>
            <g className="lid">
              <path d="M5.5 9.5h21" />
              <path d="M12.5 9V7a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 19.5 7v2" />
            </g>
            <g className="bd">
              <path d="M8 10.5l1.3 14.6a2.4 2.4 0 0 0 2.4 2.2h8.6a2.4 2.4 0 0 0 2.4-2.2L24 10.5" />
              <path d="M13.5 15v7.5M18.5 15v7.5" />
            </g>
          </svg>
        </div>
        <h2 id={`${uid}t`}>{title}</h2>
        <p id={`${uid}p`}>{description}</p>
        <div className="u436-bs">
          <button ref={noRef} type="button" className="u436-no" onClick={cancel} {...dis}>
            취소
          </button>
          <button ref={okRef} type="button" className="u436-ok" onClick={confirm} {...dis}>
            {confirmLabel}
          </button>
        </div>
      </div>
      <p className="u436-live" role="status">
        {live}
      </p>
    </div>
  );
}
