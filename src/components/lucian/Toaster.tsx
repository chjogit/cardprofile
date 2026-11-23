// Lucian UX/UI Prompt #435 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#435
"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

export type ToastAction = { label: string; onClick: () => void };
export type ToasterHandle = { show: (text: string, action?: ToastAction) => void };

type T = {
  el: HTMLDivElement;
  gone?: boolean;
  tm?: number;
  t0: number;
  left: number;
  dx?: number;
  v?: number;
};

const H = 56;
const GAP = 8;
const LIFE = 4500;
const MAX = 3;

// 저장 알림. 아래에서 튀어 오르며 체크가 그려지고 시간 막대가 줄어든다.
// 여러 번 뜨면 카드 더미처럼 겹치고(최대 3개), 커서·초점이 들어오면 펼쳐지며 시간이 멈춘다.
// 옆으로 밀거나 ×·Esc로 닫는다. 원본의 '실행 취소' 자리는 동작 버튼(예: 공개 페이지 열기)으로 쓴다.
export function Toaster({ ref }: { ref?: Ref<ToasterHandle> }) {
  const rgRef = useRef<HTMLElement>(null);
  const api = useRef<ToasterHandle["show"]>(() => {});

  useImperativeHandle(ref, () => ({ show: (text, action) => api.current(text, action) }), []);

  useEffect(() => {
    const rg = rgRef.current!;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const toasts: T[] = [];
    let open = false;
    let paused = false;
    let leaveT = 0;
    let alive = true;

    const live = () => toasts.filter((t) => !t.gone);

    function layout() {
      const l = live();
      const n = l.length;
      l.forEach((t, k) => {
        const i = n - 1 - k;
        const y = open ? -i * (H + GAP) : -i * 11;
        const s = open ? 1 : 1 - i * 0.055;
        t.el.style.setProperty("--y", y + "px");
        t.el.style.setProperty("--s", s.toFixed(3));
        t.el.style.setProperty("--o", i < MAX ? "1" : "0");
        t.el.style.zIndex = String(20 - i);
        t.el.classList.toggle("is-back", !open && i > 0);
      });
      rg.style.height = (open && n > 1 ? n * H + (n - 1) * GAP : H + 20) + "px";
    }
    function timer(t: T) {
      clearTimeout(t.tm);
      t.t0 = Date.now();
      if (!paused) t.tm = window.setTimeout(() => alive && dismiss(t), t.left);
    }
    function bar(t: T, ms: number) {
      const pb = t.el.querySelector(".u435-pb")!;
      pb.innerHTML = `<i style="animation-duration:${ms}ms"></i>`;
      t.left = ms;
      timer(t);
    }
    function dismiss(t: T, dir?: number, quiet?: boolean) {
      if (t.gone) return;
      t.gone = true;
      clearTimeout(t.tm);
      const el = t.el;
      if (el.contains(document.activeElement)) {
        const other = live().pop();
        if (other) other.el.querySelector<HTMLButtonElement>(".u435-x")!.focus({ preventScroll: true });
        else (document.activeElement as HTMLElement).blur();
      }
      el.style.pointerEvents = "none";
      const done = () => {
        el.remove();
        const i = toasts.indexOf(t);
        if (i >= 0) toasts.splice(i, 1);
      };
      layout();
      if (rm || !el.animate) return done();
      const y = el.style.getPropertyValue("--y") || "0px";
      const s = Number(el.style.getPropertyValue("--s") || "1");
      if (dir) {
        const v = Math.max(1.2, Math.abs(t.v || 0));
        const dist = 380;
        const dur = Math.max(160, Math.min(320, dist / v));
        el.classList.add("is-drag");
        el.animate(
          [
            { transform: `translate3d(${t.dx || 0}px,${y},0) scale(${s})`, opacity: 1 },
            { transform: `translate3d(${dir * dist}px,${y},0) scale(${s}) rotate(${dir * 6}deg)`, opacity: 0 },
          ],
          { duration: dur, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" },
        ).onfinish = done;
      } else {
        el.animate(
          [{ opacity: quiet ? 0 : 1 }, { transform: `translate3d(0,calc(${y} + 14px),0) scale(${s * 0.94})`, opacity: 0 }],
          { duration: 260, easing: "cubic-bezier(.4,0,.6,1)", fill: "forwards" },
        ).onfinish = done;
      }
    }
    function swipe(t: T) {
      const el = t.el;
      let on = false;
      let x0 = 0;
      let last: [number, number][] = [];
      el.addEventListener("pointerdown", (e) => {
        if (e.button !== 0 || (e.target as Element).closest("button") || t.gone) return;
        on = true;
        x0 = e.clientX;
        t.dx = 0;
        t.v = 0;
        last = [[e.clientX, e.timeStamp]];
        el.classList.add("is-drag");
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* 무시 */
        }
      });
      el.addEventListener("pointermove", (e) => {
        if (!on) return;
        t.dx = e.clientX - x0;
        last.push([e.clientX, e.timeStamp]);
        if (last.length > 5) last.shift();
        el.style.setProperty("--x", t.dx.toFixed(1) + "px");
        el.style.opacity = String(Math.max(0.35, 1 - Math.abs(t.dx) / 320));
      });
      const end = () => {
        if (!on) return;
        on = false;
        const a = last[0];
        const b = last[last.length - 1];
        t.v = b && a && b[1] > a[1] ? (b[0] - a[0]) / (b[1] - a[1]) : 0;
        el.style.opacity = "";
        const dx = t.dx || 0;
        if (Math.abs(dx) > 80 || Math.abs(t.v) > 0.6) {
          dismiss(t, (Math.abs(t.v) > 0.6 ? t.v : dx) > 0 ? 1 : -1);
          return;
        }
        el.classList.remove("is-drag");
        el.style.setProperty("--x", "0px");
        t.dx = 0;
      };
      el.addEventListener("pointerup", end);
      el.addEventListener("pointercancel", end);
    }
    function make(text: string, action?: ToastAction) {
      const el = document.createElement("div");
      el.className = "u435-t";
      el.setAttribute("role", "status");
      el.innerHTML =
        '<span class="u435-ic" aria-hidden="true"><span class="ok"><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9"/></svg></span></span>' +
        '<span class="u435-tx"><b></b></span>' +
        (action ? '<button type="button" class="u435-un"></button>' : "") +
        '<button type="button" class="u435-x" aria-label="알림 닫기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button><span class="u435-pb" aria-hidden="true"></span>';
      el.querySelector(".u435-tx b")!.textContent = text;
      const t: T = { el, t0: 0, left: LIFE };
      if (action) {
        const un = el.querySelector<HTMLButtonElement>(".u435-un")!;
        un.textContent = action.label;
        un.addEventListener("click", () => {
          action.onClick();
          dismiss(t);
        });
      }
      el.querySelector(".u435-x")!.addEventListener("click", () => dismiss(t));
      swipe(t);
      toasts.push(t);
      if (!rm) {
        el.classList.add("is-in");
        el.style.setProperty("--y", "84px");
        el.style.setProperty("--s", ".9");
        el.style.setProperty("--o", "0");
        el.style.transition = "none";
        rg.appendChild(el);
        void el.offsetWidth;
        el.style.transition = "";
      } else rg.appendChild(el);
      bar(t, LIFE);
      const l = live();
      if (l.length > MAX) dismiss(l[0], 0, true);
      layout();
    }
    function setOpen(v: boolean) {
      if (open === v) return;
      open = v;
      paused = v;
      rg.classList.toggle("is-paused", v);
      toasts.forEach((t) => {
        if (t.gone) return;
        if (v) {
          clearTimeout(t.tm);
          t.left = Math.max(500, t.left - (Date.now() - t.t0));
        } else timer(t);
      });
      layout();
    }
    const onEnter = () => {
      clearTimeout(leaveT);
      setOpen(true);
    };
    const onLeave = () => {
      clearTimeout(leaveT);
      leaveT = window.setTimeout(() => {
        if (!rg.contains(document.activeElement)) setOpen(false);
      }, 120);
    };
    const onFocusIn = () => setOpen(true);
    const onFocusOut = (e: FocusEvent) => {
      if (!rg.contains(e.relatedTarget as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const el = (e.target as Element).closest(".u435-t");
      const t = toasts.find((x) => x.el === el);
      if (t && !t.gone) {
        e.preventDefault();
        e.stopPropagation();
        dismiss(t);
      }
    };
    rg.addEventListener("pointerenter", onEnter);
    rg.addEventListener("pointerleave", onLeave);
    rg.addEventListener("focusin", onFocusIn);
    rg.addEventListener("focusout", onFocusOut);
    rg.addEventListener("keydown", onKey);
    rg.style.height = H + 20 + "px";
    api.current = make;

    return () => {
      alive = false;
      api.current = () => {};
      clearTimeout(leaveT);
      toasts.forEach((t) => {
        clearTimeout(t.tm);
        t.el.remove();
      });
      toasts.length = 0;
      rg.removeEventListener("pointerenter", onEnter);
      rg.removeEventListener("pointerleave", onLeave);
      rg.removeEventListener("focusin", onFocusIn);
      rg.removeEventListener("focusout", onFocusOut);
      rg.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="ux u435">
      <section ref={rgRef} className="u435-rg" aria-label="알림" />
    </div>
  );
}
