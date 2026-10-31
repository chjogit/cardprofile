import { loadFont } from "@remotion/google-fonts/IBMPlexSansKR";
import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CAMERA,
  CAPTIONS,
  CLICKS,
  CURSOR,
  CURSOR_SHOW,
  DRAG,
  HEIGHT,
  S,
  SCREENS,
  TYPE,
  WIDTH,
} from "./timeline";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700"] });

const INK = "#1C1B22";
const COBALT = "#2F4BFF";
const PANEL = "#EEF0F5";
const ease = Easing.bezier(0.45, 0, 0.2, 1);
const shot = (name: string) => staticFile(`shots/${name}.png`);

/** 키프레임 사이를 부드럽게 잇는다 */
function track<T extends { f: number }>(keys: T[], frame: number, pick: (k: T) => number) {
  if (frame <= keys[0].f) return pick(keys[0]);
  for (let i = 1; i < keys.length; i++) {
    if (frame <= keys[i].f) {
      return interpolate(frame, [keys[i - 1].f, keys[i].f], [pick(keys[i - 1]), pick(keys[i])], { easing: ease });
    }
  }
  return pick(keys[keys.length - 1]);
}

function useCamera(frame: number) {
  const s = track(CAMERA, frame, (k) => k.s);
  const fx = track(CAMERA, frame, (k) => k.x);
  const fy = track(CAMERA, frame, (k) => k.y);
  const tx = Math.min(0, Math.max(WIDTH - WIDTH * s, WIDTH / 2 - fx * s));
  const ty = Math.min(0, Math.max(HEIGHT - HEIGHT * s, HEIGHT / 2 - fy * s));
  return { s, tx, ty, toScreen: (x: number, y: number) => ({ x: x * s + tx, y: y * s + ty }) };
}

/** 스크린샷의 한 영역만 잘라서 보여준다 (편집기 좌표) */
function Crop({ src, x, y, w, h, style }: { src: string; x: number; y: number; w: number; h: number; style?: CSSProperties }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", ...style }}>
      <Img src={shot(src)} style={{ position: "absolute", left: -x, top: -y, width: WIDTH, height: HEIGHT }} />
    </div>
  );
}

function Screens({ frame }: { frame: number }) {
  let cur = 0;
  SCREENS.forEach((sc, i) => {
    if (frame >= sc.f) cur = i;
  });
  const now = SCREENS[cur];
  const prev = SCREENS[cur - 1];
  const fade = now.fade ?? 1;
  const o = interpolate(frame, [now.f, now.f + fade], [0, 1], { extrapolateRight: "clamp" });
  return (
    <>
      {prev && o < 1 && <Img src={shot(prev.src)} style={{ position: "absolute", width: WIDTH, height: HEIGHT }} />}
      <Img src={shot(now.src)} style={{ position: "absolute", width: WIDTH, height: HEIGHT, opacity: prev ? o : 1 }} />
    </>
  );
}

/** "굿즈 스토어"를 한 글자씩 치는 것처럼 보이게, 완성된 칸을 왼쪽부터 드러낸다 */
function Typing({ frame }: { frame: number }) {
  if (frame < TYPE.from - 2 || frame >= TYPE.to + 1) return null;
  const r = TYPE.rect;
  // 글자 단위로 끊어서 드러낸다 (6글자, 띄어쓰기 포함)
  const steps = 6;
  const k = Math.floor(interpolate(frame, [TYPE.from, TYPE.to], [0, steps], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const textW = 66; // "굿즈 스토어" 폭 (px)
  const pad = 13;
  const shown = pad + (textW * k) / steps;
  const caretOn = Math.floor(frame / 8) % 2 === 0;
  return (
    <>
      {/* 빈 입력칸 (02 화면에서 "새 링크" 지운 상태) */}
      <div
        style={{
          position: "absolute",
          left: r.left + 2,
          top: r.top + 2,
          width: r.w - 4,
          height: r.h - 4,
          background: "#fff",
          borderRadius: 8,
          boxShadow: `0 0 0 2px ${COBALT}`,
        }}
      />
      <Crop src="03-typed" x={r.left + 2} y={r.top + 4} w={shown} h={r.h - 8} />
      <div
        style={{
          position: "absolute",
          left: r.left + 2 + shown + 1,
          top: r.top + 10,
          width: 1.5,
          height: r.h - 20,
          background: INK,
          opacity: caretOn ? 1 : 0,
        }}
      />
    </>
  );
}

/** 블록을 집어 올려 옮기는 동안의 모습 */
function Dragging({ frame, cursorY }: { frame: number; cursorY: number }) {
  if (frame < DRAG.down || frame >= DRAG.up) return null;
  const row = DRAG.fromRow;
  const lift = spring({ frame: frame - DRAG.down, fps: 30, config: { damping: 18 } });
  const dy = cursorY - DRAG.from.y;
  // 위에 있는 두 블록이 한 칸씩 내려가 자리를 내준다
  const gap = row.h + 8;
  const progress = Math.min(1, Math.max(0, -dy / (DRAG.from.y - DRAG.to.y)));
  const r1 = DRAG.toRow; // 작업 포트폴리오
  const r2 = { top: DRAG.toRow.top + gap, h: row.h }; // 소셜 아이콘
  const shift1 = interpolate(progress, [0.15, 0.6], [0, gap], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const shift2 = interpolate(progress, [0.05, 0.3], [0, gap], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  return (
    <>
      {/* 원래 목록 자리를 지우고 다시 그린다 */}
      <div style={{ position: "absolute", left: 0, top: r1.top - 4, width: 399, height: gap * 3 + 4, background: PANEL }} />
      <Crop src="04-collapsed" x={r1.left} y={r1.top} w={r1.w} h={r1.h} style={{ transform: `translateY(${shift1}px)` }} />
      <Crop src="04-collapsed" x={r1.left} y={r2.top} w={r1.w} h={r2.h} style={{ transform: `translateY(${shift2}px)` }} />
      {/* 자리 표시 */}
      <div
        style={{
          position: "absolute",
          left: row.left,
          top: row.top + dy + 0,
          width: row.w,
          height: row.h,
          borderRadius: 16,
          border: `2px solid ${COBALT}`,
          background: "#fff",
          boxShadow: `0 ${6 + lift * 12}px ${12 + lift * 24}px rgba(28,27,48,${0.08 + lift * 0.14})`,
          transform: `scale(${1 + lift * 0.03}) rotate(${lift * -0.6}deg)`,
          overflow: "hidden",
        }}
      >
        <Crop src="04-collapsed" x={row.left + 2} y={row.top + 2} w={row.w - 4} h={row.h - 4} style={{ left: 0, top: 0 }} />
      </div>
    </>
  );
}

function Cursor({ x, y, press, visible }: { x: number; y: number; press: number; visible: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: visible, transform: `scale(${1 - press * 0.18})`, transformOrigin: "0 0" }}>
      <svg width="30" height="34" viewBox="0 0 24 28" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,.35))" }}>
        <path d="M2 1 L2 22 L7.5 17 L11 25.5 L14.6 24 L11.2 15.8 L18.6 15.8 Z" fill="#fff" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Ripples({ frame, toScreen }: { frame: number; toScreen: (x: number, y: number) => { x: number; y: number } }) {
  return (
    <>
      {CLICKS.map((c) => {
        const t = frame - c;
        if (t < 0 || t > 16) return null;
        const at = { x: track(CURSOR, c, (k) => k.x), y: track(CURSOR, c, (k) => k.y) };
        const p = toScreen(at.x, at.y);
        const r = interpolate(t, [0, 16], [6, 34], { easing: Easing.out(Easing.cubic) });
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: p.x - r,
              top: p.y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              border: `3px solid ${COBALT}`,
              opacity: interpolate(t, [0, 16], [0.8, 0]),
            }}
          />
        );
      })}
    </>
  );
}

function Caption({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const c = CAPTIONS.find((x) => frame >= x.from - 2 && frame < x.to + 8);
  if (!c) return null;
  const inn = spring({ frame: frame - c.from, fps, config: { damping: 16, mass: 0.6 } });
  const out = interpolate(frame, [c.to, c.to + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        ...(c.top ? { top: 36 } : { bottom: 40 }),
        display: "flex",
        justifyContent: "center",
        opacity: inn * (1 - out),
        transform: `translateY(${(1 - inn) * 30 + out * 12}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 26px 14px 14px",
          borderRadius: 999,
          background: "rgba(28,27,34,.92)",
          color: "#fff",
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          boxShadow: "0 14px 40px rgba(20,20,40,.28)",
        }}
      >
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: 44,
            height: 44,
            borderRadius: 999,
            background: COBALT,
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          {c.n}
        </span>
        {c.text}
      </div>
    </div>
  );
}

function Title({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const a = spring({ frame: frame - 4, fps, config: { damping: 14 } });
  const b = spring({ frame: frame - 14, fps, config: { damping: 14 } });
  const out = interpolate(frame, [S.editorIn - 6, S.editorIn + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  if (out >= 1) return null;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 0%, #ffffff 0%, ${PANEL} 60%, #dfe3f3 100%)`,
        alignItems: "center",
        justifyContent: "center",
        opacity: 1 - out,
      }}
    >
      <Logo size={96} style={{ opacity: a, transform: `translateY(${(1 - a) * 30}px) scale(${1 - out * 0.06})` }} />
      <p
        style={{
          marginTop: 26,
          fontSize: 38,
          color: "#4a4a57",
          fontWeight: 400,
          letterSpacing: "-0.02em",
          opacity: b,
          transform: `translateY(${(1 - b) * 24}px)`,
        }}
      >
        링크 하나로 나를 소개하는 프로필 카드
      </p>
    </AbsoluteFill>
  );
}

function Logo({ size, style }: { size: number; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.22, ...style }}>
      <div
        style={{
          width: size * 0.82,
          height: size * 0.82,
          borderRadius: size * 0.24,
          background: COBALT,
          display: "grid",
          placeItems: "center",
          boxShadow: `0 ${size * 0.12}px ${size * 0.3}px rgba(47,75,255,.35)`,
        }}
      >
        <div style={{ width: size * 0.44, height: size * 0.52, borderRadius: size * 0.08, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: size * 0.07, gap: size * 0.045 }}>
          <div style={{ width: size * 0.14, height: size * 0.14, borderRadius: 99, background: COBALT }} />
          <div style={{ width: size * 0.26, height: size * 0.05, borderRadius: 99, background: INK }} />
          <div style={{ width: size * 0.3, height: size * 0.07, borderRadius: 99, background: COBALT, opacity: 0.6 }} />
        </div>
      </div>
      <span style={{ fontSize: size * 0.78, fontWeight: 700, color: INK, letterSpacing: "-0.04em" }}>CardProfile</span>
    </div>
  );
}

function UrlPill({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 22px",
        borderRadius: 999,
        background: "#fff",
        color: INK,
        fontSize: 26,
        fontWeight: 600,
        boxShadow: "0 10px 30px rgba(20,20,40,.15)",
        ...style,
      }}
    >
      <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
        <rect x="2" y="9" width="16" height="12" rx="3" fill="#1F8A6B" />
        <path d="M6 9V6.5a4 4 0 0 1 8 0V9" stroke="#1F8A6B" strokeWidth="2.4" />
      </svg>
      {children}
    </div>
  );
}

/** 저장 뒤 공개 페이지가 휴대폰으로 올라오고, 마지막에 로고와 주소가 나온다 */
function PublicReveal({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  if (frame < S.publicIn) return null;
  const t = frame - S.publicIn;
  const dim = interpolate(t, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const solid = interpolate(frame, [S.outro, S.outro + 12], [0.94, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const up = spring({ frame: t, fps, config: { damping: 15, mass: 0.8 } });
  const url = spring({ frame: t - 16, fps, config: { damping: 14 } });
  const toOutro = spring({ frame: frame - S.outro, fps, config: { damping: 18 } });
  const brand = spring({ frame: frame - S.outro - 6, fps, config: { damping: 16 } });
  const phoneW = 330;
  const phoneH = 660;
  const phoneX = WIDTH / 2 - phoneW / 2 - toOutro * 250;
  const phoneY = HEIGHT / 2 - phoneH / 2 + 20 + (1 - up) * 700 - toOutro * 20;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(160deg, rgba(238,240,245,${solid}), rgba(214,220,246,${Math.max(solid, 0.97)}))`, opacity: dim }} />
      <div
        style={{
          position: "absolute",
          left: phoneX,
          top: phoneY,
          width: phoneW,
          height: phoneH,
          borderRadius: 48,
          background: INK,
          padding: 11,
          boxShadow: "0 40px 90px rgba(20,20,50,.35)",
          transform: `rotate(${(1 - up) * 6}deg)`,
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: 38, overflow: "hidden", background: "#DDF1E8", position: "relative" }}>
          <Img src={shot("12-public")} style={{ width: "100%", position: "absolute", top: 0 }} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 26,
          display: "flex",
          justifyContent: "center",
          opacity: url * (1 - toOutro),
          transform: `translateY(${(1 - url) * -30}px)`,
        }}
      >
        <UrlPill>cardprofile-xi.vercel.app/hana</UrlPill>
      </div>
      <div
        style={{
          position: "absolute",
          left: 610,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 28,
          opacity: brand,
          transform: `translateX(${(1 - brand) * 40}px)`,
        }}
      >
        <Logo size={84} />
        <p style={{ fontSize: 34, color: "#4a4a57", letterSpacing: "-0.02em", lineHeight: 1.45 }}>
          블록 편집 · 프리셋 6종 · 글꼴 60개
          <br />
          가입하고 바로 내 카드 만들기
        </p>
        <div>
          <UrlPill style={{ fontSize: 28 }}>cardprofile-xi.vercel.app</UrlPill>
        </div>
      </div>
    </AbsoluteFill>
  );
}

export const Demo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCamera(frame);

  const enter = spring({ frame: frame - S.editorIn + 6, fps, config: { damping: 18 } });
  const cx = track(CURSOR, frame, (k) => k.x);
  const cy = track(CURSOR, frame, (k) => k.y);
  const cursorScreen = cam.toScreen(cx, cy);
  const press = Math.max(
    ...CLICKS.map((c) => interpolate(frame, [c - 3, c, c + 4], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
    frame >= DRAG.down && frame < DRAG.up ? 1 : 0,
  );
  const visible =
    interpolate(frame, [CURSOR_SHOW[0], CURSOR_SHOW[0] + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    interpolate(frame, [CURSOR_SHOW[1] - 8, CURSOR_SHOW[1]], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily, background: PANEL }}>
      <AbsoluteFill style={{ transform: `scale(${0.94 + enter * 0.06})`, opacity: Math.min(1, enter * 1.4) }}>
        <div
          style={{
            position: "absolute",
            width: WIDTH,
            height: HEIGHT,
            transformOrigin: "0 0",
            transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.s})`,
          }}
        >
          <Screens frame={frame} />
          <Typing frame={frame} />
          <Dragging frame={frame} cursorY={cy} />
        </div>
        <Ripples frame={frame} toScreen={cam.toScreen} />
        <Cursor x={cursorScreen.x - 4} y={cursorScreen.y - 2} press={press} visible={visible} />
      </AbsoluteFill>
      <Caption frame={frame} />
      <PublicReveal frame={frame} />
      <Title frame={frame} />
    </AbsoluteFill>
  );
};
