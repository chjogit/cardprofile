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
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 해요.");
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

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="text-lg font-bold">
        카드프로필
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

      {isSupabaseConfigured && (
        <button onClick={google} className="btn btn-ghost mt-3 w-full py-3">
          Google로 계속하기
        </button>
      )}

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
