"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DemoNotice } from "@/components/DemoNotice";
import { signIn, signInWithGoogle, signUp } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">(
    params.get("mode") === "signup" ? "signup" : "login",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (isSignup && password.length < 8) {
      setError("비밀번호는 8자 이상이어야 해요.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { needsConfirm } = await signUp(email.trim(), password);
        if (needsConfirm) {
          setInfo("인증 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해주세요.");
          setMode("login");
          return;
        }
      } else {
        await signIn(email.trim(), password);
      }
      router.push("/editor");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const isSignup = mode === "signup";

  // 실제 서비스(Supabase 연결)에서는 Google 로그인 하나만 쓴다. 가입과 로그인이 같은 버튼이다.
  // 이메일 폼은 Supabase 없이 도는 체험 모드에서만 남긴다(체험 모드는 Google을 쓸 수 없다).
  if (isSupabaseConfigured) {
    return (
      <div className="w-full max-w-sm">
        <Link href="/" className="text-lg font-bold">
          CardProfile
        </Link>
        <h1 className="mt-8 text-3xl font-bold">{isSignup ? "가입하고 카드 만들기" : "다시 오셨네요"}</h1>
        <p className="mt-2 text-ink-soft">
          Google 계정으로 바로 시작해요.
          <br />
          처음이면 자동으로 가입돼요.
        </p>
        <button
          type="button"
          onClick={async () => {
            setBusy(true);
            await google();
            setBusy(false);
          }}
          disabled={busy}
          className="btn btn-ghost mt-8 w-full gap-3 bg-surface py-3 text-base disabled:opacity-60"
        >
          <GoogleMark />
          {busy ? "Google로 이동 중..." : "Google로 계속하기"}
        </button>
        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="text-lg font-bold">
        CardProfile
      </Link>
      <h1 className="mt-8 text-3xl font-bold">{isSignup ? "가입하고 카드 만들기" : "다시 오셨네요"}</h1>
      <p className="mt-2 text-ink-soft">
        {isSignup ? "이메일만 있으면 바로 시작할 수 있어요." : "로그인하고 카드를 이어서 편집하세요."}
      </p>

      <DemoNotice className="mt-6" />

      <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          이메일
          <input
            className="field"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          비밀번호
          <input
            className="field"
            type="password"
            required
            autoComplete={isSignup ? "new-password" : "current-password"}
            minLength={isSignup ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {info && <p className="text-sm text-cobalt" role="status">{info}</p>}
        <button className="btn btn-primary mt-2 py-3" disabled={busy}>
          {busy ? "잠시만요..." : isSignup ? "가입하기" : "로그인"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        {isSignup ? "이미 계정이 있나요? " : "처음이신가요? "}
        <button
          type="button"
          className="font-semibold text-cobalt underline-offset-2 hover:underline"
          onClick={() => {
            setMode(isSignup ? "login" : "signup");
            setError("");
          }}
        >
          {isSignup ? "로그인" : "가입하기"}
        </button>
      </p>
    </div>
  );
}

// Google 로고(브랜드 가이드의 네 색 G)
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
