import { isSupabaseConfigured } from "@/lib/supabase";

export function DemoNotice({ className = "" }: { className?: string }) {
  if (isSupabaseConfigured) return null;
  return (
    <p className={`rounded-xl bg-cobalt-soft px-4 py-3 text-sm leading-relaxed text-ink ${className}`}>
      지금은 체험 모드예요. 계정과 카드가 이 브라우저에만 저장돼요.
    </p>
  );
}
