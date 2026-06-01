import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogIn, ChevronRight } from "lucide-react";
import { TEAM_LOGOS } from "@/utils/constants";
import type { KboTeam } from "@/types";

export default async function MyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
          <LogIn size={32} className="text-gray-400" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">로그인이 필요해요</p>
          <p className="text-sm text-gray-400 mt-1">직관 기록을 저장하고<br />최애 팀·선수를 설정해보세요</p>
        </div>
        <Link
          href="/login"
          className="w-full max-w-xs bg-navy-600 text-white font-bold py-3 rounded-2xl text-center"
        >
          로그인 / 회원가입
        </Link>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, favorite_team, favorite_players")
    .eq("id", user.id)
    .single();

  const favoriteTeam = (profile?.favorite_team as KboTeam) || null;
  const playerIds: number[] = profile?.favorite_players || [];

  let playerNames: string[] = [];
  if (playerIds.length > 0) {
    const { data } = await supabase
      .from("players")
      .select("name")
      .in("id", playerIds);
    if (data) playerNames = data.map((p) => p.name);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center">
          <span className="text-navy-600 font-bold text-lg">
            {user.email?.[0].toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-bold text-gray-900">{profile?.username || user.email}</p>
          <p className="text-xs text-gray-400">KBO 야구 팬</p>
        </div>
      </div>

      <Link href="/mypage/favorites"
        className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 active:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          {favoriteTeam ? (
            <img src={TEAM_LOGOS[favoriteTeam]} alt={favoriteTeam} className="w-10 h-10 object-contain" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-lg">⚾</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            {favoriteTeam ? (
              <div className="space-y-1">
                <p className="text-sm text-gray-900 flex items-center gap-1.5">
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">최애 팀</span>
                  <span className="font-semibold">{favoriteTeam}</span>
                </p>
                {playerNames.length > 0 && (
                  <p className="text-xs text-gray-600 flex items-center gap-1.5 truncate">
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium shrink-0">최애 선수</span>
                    <span className="truncate">{playerNames.join(", ")}</span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm font-semibold text-gray-900">최애 팀을 설정해보세요</p>
            )}
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </div>
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Link href="/mypage/observations"
          className="flex items-center gap-4 p-4 active:bg-gray-50 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center">
            <span className="text-lg">📝</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">직관 기록</p>
            <p className="text-xs text-gray-400">경기 직접 관람 기록 관리</p>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </Link>
      </div>

      <form action="/api/auth/signout" method="POST">
        <button
          type="submit"
          className="w-full py-3 rounded-2xl border border-gray-200 text-gray-500 text-sm font-semibold"
        >
          로그아웃
        </button>
      </form>
    </div>
  );
}
