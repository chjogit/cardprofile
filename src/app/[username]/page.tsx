import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CardView } from "@/components/CardView";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { normalizeCard } from "@/lib/themes";
import type { Block, Card } from "@/lib/types";
import { DemoPublicCard } from "./DemoPublicCard";

type Props = { params: Promise<{ username: string }> };

async function loadCard(username: string): Promise<Card | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from("profiles")
    .select("card")
    .eq("username", username.toLowerCase())
    .eq("published", true)
    .maybeSingle();
  return data?.card ? normalizeCard(data.card) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const card = isSupabaseConfigured ? await loadCard(username) : null;
  const profile = card?.blocks.find((b): b is Extract<Block, { type: "profile" }> => b.type === "profile");
  return {
    title: profile ? `${profile.name} · CardProfile` : `${username} · CardProfile`,
    description: profile?.bio,
  };
}

async function PublicCard({ params }: Props) {
  const { username } = await params;
  if (!isSupabaseConfigured) return <DemoPublicCard username={username} />;
  const card = await loadCard(username);
  if (!card) notFound();
  return <CardView card={card} className="min-h-dvh" />;
}

export default function Page(props: Props) {
  return (
    <main className="flex flex-1 flex-col">
      <Suspense fallback={<div className="min-h-dvh" />}>
        <PublicCard {...props} />
      </Suspense>
    </main>
  );
}
