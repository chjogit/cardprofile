// Lucian UX/UI Prompt #008 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#008
"use client";

import { useEffect, useRef, useState } from "react";

// 공개 주소를 보여 주고 한 번에 복사한다. 누르면 아이콘이 체크로 바뀌고 '복사됨' 말풍선이 뜬다.
export function CopyLink({
  url,
  host,
  path,
  size,
  className = "",
}: {
  url: string;
  host: string;
  path: string;
  size?: "sm";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const [tip, setTip] = useState("");

  useEffect(() => () => clearTimeout(timer.current), []);

  function copy() {
    try {
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).catch(() => {});
    } catch {
      /* 막힌 환경에서도 화면 반응은 똑같이 보여 준다 */
    }
    const root = ref.current;
    if (!root) return;
    clearTimeout(timer.current);
    root.classList.remove("is-copied");
    void root.offsetWidth;
    root.classList.add("is-copied");
    setTip("복사됨");
    timer.current = window.setTimeout(() => {
      root.classList.remove("is-copied");
      setTip("");
    }, 1800);
  }

  return (
    <div ref={ref} className={`ux u008${size === "sm" ? " u008--sm" : ""} ${className}`}>
      <div className="u008-box">
        <code className="u008-code" title={url}>
          {host}
          <b>{path}</b>
        </code>
        <button className="u008-btn" type="button" aria-label="공개 주소 복사" onClick={copy}>
          <svg className="u008-cp" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="8.5" y="8.5" width="11" height="11" rx="2.5" />
            <path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
          </svg>
          <svg className="u008-ok" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5.5 12.5l4.2 4.2L18.5 8" />
          </svg>
        </button>
        <span className="u008-tip" role="status">
          {tip}
        </span>
      </div>
    </div>
  );
}
