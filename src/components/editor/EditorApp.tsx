"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CardView } from "@/components/CardView";
import { DemoNotice } from "@/components/DemoNotice";
import { RESERVED_USERNAMES, USERNAME_RE, defaultCard } from "@/lib/defaults";
import { getMyProfile, getUser, isUsernameTaken, saveProfile, signOut, type User } from "@/lib/store";
import type { Card } from "@/lib/types";
import { BlockList } from "./BlockList";
import { DesignPanel } from "./DesignPanel";

type Status = "loading" | "choose-username" | "ready";

export function EditorApp() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [card, setCard] = useState<Card>(() => defaultCard());
  const [published, setPublished] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<"blocks" | "design">("blocks");
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    (async () => {
      const u = await getUser();
      if (!u) {
        router.replace("/login");
        return;
      }
      setUser(u);
      const p = await getMyProfile(u.id);
      if (p) {
        setUsername(p.username);
        setCard(p.card);
        setPublished(p.published);
        setStatus("ready");
      } else {
        setStatus("choose-username");
      }
    })().catch((e) => setMessage((e as Error).message));
  }, [router]);

  // 저장 안 한 변경이 있으면 페이지를 떠날 때 확인
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  function update(c: Card) {
    setCard(c);
    setDirty(true);
    setMessage("");
  }

  async function save(nextPublished = published) {
    if (!user) return;
    setSaving(true);
    setMessage("");
    try {
      await saveProfile({ id: user.id, username, card, published: nextPublished });
      setPublished(nextPublished);
      setDirty(false);
      setMessage(nextPublished ? "저장했어요. 공개 페이지에 바로 반영돼요." : "저장했어요. 지금은 비공개예요.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading") {
    return <main className="grid flex-1 place-items-center text-ink-soft">{message || "불러오는 중..."}</main>;
  }

  if (status === "choose-username" && user) {
    return (
      <UsernameStep
        userId={user.id}
        onDone={async (name) => {
          const c = defaultCard();
          await saveProfile({ id: user.id, username: name, card: c, published: true });
          setUsername(name);
          setCard(c);
          setStatus("ready");
        }}
      />
    );
  }

  const publicPath = `/${username}`;

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center gap-3 border-b border-line bg-surface px-4 py-2.5">
        <Link href="/" className="font-bold">
          CardProfile
        </Link>
        <a
          href={publicPath}
          target="_blank"
          className="hidden truncate rounded-full bg-paper px-3 py-1 text-sm text-ink-soft hover:text-ink md:block"
        >
          {typeof window !== "undefined" ? location.host : ""}
          {publicPath}
        </a>
        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => save(e.target.checked)}
              className="h-4 w-4 accent-[var(--cobalt)]"
            />
            공개
          </label>
          <button className="btn btn-primary" onClick={() => save()} disabled={saving || !dirty}>
            {saving ? "저장 중..." : dirty ? "저장" : "저장됨"}
          </button>
          <button
            className="btn btn-ghost hidden sm:inline-flex"
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
          >
            로그아웃
          </button>
        </div>
      </header>

      {message && (
        <p role="status" className="border-b border-line bg-cobalt-soft px-4 py-2 text-sm">
          {message}{" "}
          {published && !dirty && message.startsWith("저장") && (
            <a href={publicPath} target="_blank" className="font-semibold text-cobalt underline">
              공개 페이지 보기
            </a>
          )}
        </p>
      )}

      {/* 휴대폰에서는 편집과 미리보기를 번갈아 본다 */}
      <div className="flex border-b border-line bg-surface md:hidden">
        {(["edit", "preview"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            aria-pressed={mobileView === v}
            className="flex-1 py-2.5 text-sm font-medium text-ink-soft aria-pressed:text-cobalt aria-pressed:shadow-[inset_0_-2px_0_var(--cobalt)]"
          >
            {v === "edit" ? "편집" : "미리보기"}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1">
        <aside
          className={`w-full shrink-0 overflow-y-auto border-r border-line bg-paper md:block md:w-[400px] ${
            mobileView === "edit" ? "block" : "hidden"
          }`}
        >
          <div className="sticky top-0 z-10 flex gap-1 bg-paper px-4 pb-2 pt-4">
            {(["blocks", "design"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                aria-pressed={tab === t}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-ink-soft aria-pressed:bg-ink aria-pressed:text-white"
              >
                {t === "blocks" ? "블록" : "디자인"}
              </button>
            ))}
          </div>
          <div className="px-4 pb-10 pt-2">
            <DemoNotice className="mb-4" />
            {tab === "blocks" ? (
              <BlockList blocks={card.blocks} design={card.design} onChange={(blocks) => update({ ...card, blocks })} />
            ) : (
              <DesignPanel card={card} onChange={update} />
            )}
            <button
              className="btn btn-ghost mt-8 w-full sm:hidden"
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
            >
              로그아웃
            </button>
          </div>
        </aside>

        <section
          className={`min-w-0 flex-1 flex-col bg-[#dfe2ea] md:flex ${mobileView === "preview" ? "flex" : "hidden"}`}
        >
          <div className="hidden justify-center gap-1 pt-3 md:flex">
            {(["mobile", "desktop"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                aria-pressed={device === d}
                className="rounded-full px-3.5 py-1 text-sm text-ink-soft aria-pressed:bg-surface aria-pressed:text-ink aria-pressed:shadow-sm"
              >
                {d === "mobile" ? "휴대폰" : "데스크톱"}
              </button>
            ))}
          </div>
          <div className="flex min-h-0 flex-1 justify-center overflow-auto md:p-5">
            <div
              className={`overflow-y-auto bg-white transition-[width] ${
                device === "mobile"
                  ? "w-full md:h-[760px] md:max-h-full md:w-[390px] md:rounded-[36px] md:border-[10px] md:border-ink"
                  : "w-full md:rounded-xl"
              }`}
            >
              <CardView card={card} className="min-h-full" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function UsernameStep({ userId, onDone }: { userId: string; onDone: (name: string) => Promise<void> }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = name.trim().toLowerCase();
    if (!USERNAME_RE.test(v)) {
      setError("영문 소문자, 숫자, -, _ 로 3~20자를 써주세요. 첫 글자는 영문이나 숫자여야 해요.");
      return;
    }
    if (RESERVED_USERNAMES.has(v)) {
      setError("이 주소는 쓸 수 없어요. 다른 이름을 골라주세요.");
      return;
    }
    setBusy(true);
    try {
      if (await isUsernameTaken(v, userId)) {
        setError("이미 누군가 쓰고 있는 주소예요.");
        return;
      }
      await onDone(v);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-md">
        <h1 className="text-3xl font-bold">카드 주소를 정해주세요</h1>
        <p className="mt-2 text-ink-soft">다른 사람들이 이 주소로 내 카드를 보게 돼요. 나중에는 바꿀 수 없어요.</p>
        <div className="mt-6 flex items-center rounded-xl border border-line bg-surface pl-3 focus-within:border-cobalt">
          <span className="text-ink-soft">{typeof window !== "undefined" ? location.host : ""}/</span>
          <input
            autoFocus
            className="w-full bg-transparent py-3 pr-3 outline-none"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="myname"
            aria-label="카드 주소"
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
        <button className="btn btn-primary mt-4 w-full py-3" disabled={busy || !name}>
          {busy ? "확인 중..." : "이 주소로 시작하기"}
        </button>
      </form>
    </main>
  );
}
