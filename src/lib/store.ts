"use client";

// 데이터 저장소. Supabase 환경변수가 있으면 Supabase를 쓰고,
// 없으면 이 브라우저의 localStorage에 저장하는 데모 모드로 동작한다.
import { fileToDataUrl, fileToJpegBlob } from "./image";
import { getSupabase } from "./supabase";
import { normalizeCard } from "./themes";
import type { Card, Profile } from "./types";

export type User = { id: string; email: string };

type DemoDb = {
  users: { id: string; email: string; password: string }[];
  profiles: Profile[];
  session: string | null;
};

const DEMO_KEY = "cardprofile-demo-v1";

function readDemo(): DemoDb {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (raw) return JSON.parse(raw) as DemoDb;
  } catch {}
  return { users: [], profiles: [], session: null };
}

function writeDemo(db: DemoDb) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(db));
}

type ProfileRow = {
  id: string;
  username: string;
  card: Card;
  published: boolean;
  updated_at: string;
};

const fromRow = (r: ProfileRow): Profile => ({
  id: r.id,
  username: r.username,
  card: normalizeCard(r.card),
  published: r.published,
  updatedAt: r.updated_at,
});

export async function getUser(): Promise<User | null> {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb.auth.getSession();
    const u = data.session?.user;
    return u ? { id: u.id, email: u.email ?? "" } : null;
  }
  const db = readDemo();
  const u = db.users.find((x) => x.id === db.session);
  return u ? { id: u.id, email: u.email } : null;
}

export async function signUp(
  email: string,
  password: string,
): Promise<{ needsConfirm: boolean }> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) throw new Error(translateAuthError(error.message));
    return { needsConfirm: !data.session };
  }
  const db = readDemo();
  if (db.users.some((u) => u.email === email)) {
    throw new Error("이미 가입한 이메일이에요. 로그인해주세요.");
  }
  const id = crypto.randomUUID();
  db.users.push({ id, email, password });
  db.session = id;
  writeDemo(db);
  return { needsConfirm: false };
}

export async function signIn(email: string, password: string) {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw new Error(translateAuthError(error.message));
    return;
  }
  const db = readDemo();
  const u = db.users.find((x) => x.email === email && x.password === password);
  if (!u) throw new Error("이메일 또는 비밀번호가 맞지 않아요.");
  db.session = u.id;
  writeDemo(db);
}

export async function signInWithGoogle() {
  const sb = getSupabase();
  if (!sb) throw new Error("Google 로그인은 Supabase를 연결한 뒤에 쓸 수 있어요.");
  const { error } = await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${location.origin}/editor` },
  });
  if (error) throw new Error(error.message);
}

export async function signOut() {
  const sb = getSupabase();
  if (sb) {
    await sb.auth.signOut();
    return;
  }
  const db = readDemo();
  db.session = null;
  writeDemo(db);
}

export async function getMyProfile(userId: string): Promise<Profile | null> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? fromRow(data as ProfileRow) : null;
  }
  const p = readDemo().profiles.find((x) => x.id === userId);
  return p ? { ...p, card: normalizeCard(p.card) } : null;
}

export async function isUsernameTaken(username: string, userId: string) {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();
    return Boolean(data && data.id !== userId);
  }
  return readDemo().profiles.some((p) => p.username === username && p.id !== userId);
}

export async function saveProfile(p: Omit<Profile, "updatedAt">): Promise<Profile> {
  const updatedAt = new Date().toISOString();
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("profiles")
      .upsert({
        id: p.id,
        username: p.username,
        card: p.card,
        published: p.published,
        updated_at: updatedAt,
      })
      .select()
      .single();
    if (error) {
      if (error.code === "23505") throw new Error("이미 누군가 쓰고 있는 주소예요.");
      throw new Error(error.message);
    }
    return fromRow(data as ProfileRow);
  }
  const db = readDemo();
  const saved = { ...p, updatedAt };
  db.profiles = [...db.profiles.filter((x) => x.id !== p.id), saved];
  writeDemo(db);
  return saved;
}

/**
 * 이미지를 올리고 카드에 넣을 주소를 돌려준다.
 * Supabase에서는 Storage의 images 버킷에, 체험 모드에서는 카드 데이터 안에 저장한다.
 */
export async function uploadImage(file: File, maxSize = 640): Promise<string> {
  const sb = getSupabase();
  if (!sb) return fileToDataUrl(file, maxSize);
  const user = await getUser();
  if (!user) throw new Error("로그인이 필요해요.");
  const blob = await fileToJpegBlob(file, maxSize);
  const path = `${user.id}/${crypto.randomUUID()}.jpg`;
  const { error } = await sb.storage.from("images").upload(path, blob, { contentType: "image/jpeg" });
  if (error) throw new Error(`이미지를 올리지 못했어요: ${error.message}`);
  return sb.storage.from("images").getPublicUrl(path).data.publicUrl;
}

// 데모 모드에서 공개 페이지가 쓰는 조회. Supabase 모드에서는 서버에서 조회한다.
export function getDemoPublicProfile(username: string): Profile | null {
  return (
    readDemo().profiles.find((p) => p.username === username && p.published) ?? null
  );
}

function translateAuthError(msg: string) {
  if (/invalid login credentials/i.test(msg)) return "이메일 또는 비밀번호가 맞지 않아요.";
  if (/already registered/i.test(msg)) return "이미 가입한 이메일이에요. 로그인해주세요.";
  if (/at least 6 characters/i.test(msg)) return "비밀번호는 6자 이상이어야 해요.";
  if (/email not confirmed/i.test(msg)) return "메일함에서 인증 링크를 먼저 눌러주세요.";
  return msg;
}
