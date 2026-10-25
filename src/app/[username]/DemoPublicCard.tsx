"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { CardView } from "@/components/CardView";
import { getDemoPublicProfile } from "@/lib/store";
import { normalizeCard } from "@/lib/themes";
import type { Card } from "@/lib/types";

export function DemoPublicCard({ username }: { username: string }) {
  // localStorage는 브라우저에만 있으므로 서버 렌더에서는 빈 화면을 그린다.
  // 스냅샷은 매번 같은 값이어야 해서 JSON 문자열로 비교한다.
  const raw = useSyncExternalStore(
    noopSubscribe,
    () => JSON.stringify(getDemoPublicProfile(username.toLowerCase())?.card ?? null),
    () => undefined,
  );

  if (raw === undefined) return <div className="min-h-dvh" />;
  const parsed = JSON.parse(raw) as Card | null;
  const card = parsed && normalizeCard(parsed);
  if (card === null) return <NotFoundCard />;
  return <CardView card={card} className="min-h-dvh" />;
}

const noopSubscribe = () => () => {};

export function NotFoundCard() {
  return (
    <div className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-bold">카드를 찾을 수 없어요</h1>
        <p className="mt-2 text-ink-soft">주소가 맞는지, 또는 카드가 공개 상태인지 확인해주세요.</p>
        <Link href="/" className="btn btn-primary mt-6">
          내 카드 만들기
        </Link>
      </div>
    </div>
  );
}
