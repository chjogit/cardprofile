// Lucian UX/UI Prompt #433 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#433
"use client";

import { useState } from "react";

// 누르는 동안 손잡이가 늘어났다가 놓으면 스프링처럼 미끄러지는 스위치.
export function PublicSwitch({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  const [press, setPress] = useState(false);
  const up = () => setPress(false);
  return (
    <label
      className={`ux u433-row u433-sw-row${press ? " is-press" : ""}`}
      onPointerDown={(e) => {
        if (e.button === 0 && !disabled) setPress(true);
      }}
      onPointerUp={up}
      onPointerLeave={up}
      onPointerCancel={up}
    >
      {label}
      <input
        className="u433-in"
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        onKeyDown={(e) => {
          if (e.key === " ") setPress(true);
        }}
        onKeyUp={up}
      />
      <span className="u433-sw" aria-hidden="true" />
    </label>
  );
}
