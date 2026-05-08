import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { KBO_TEAMS, TEAM_COLORS } from "@/utils/constants";
import type { KboTeam } from "@/types";

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="p-4 space-y-6">
      <section>
        <h2 className="text-sm font-bold text-gray-700 mb-3">최애 팀 선택</h2>
        <div className="grid grid-cols-5 gap-2">
          {KBO_TEAMS.map((team: KboTeam) => {
            const color = TEAM_COLORS[team];
            return (
              <button
                key={team}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-gray-100 bg-white shadow-sm active:scale-95 transition-transform"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: color.primary }}
                >
                  {team}
                </div>
                <span className="text-xs text-gray-600">{team}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-gray-700 mb-3">최애 선수 설정</h2>
        <div className="bg-gray-50 rounded-2xl p-4 text-center text-sm text-gray-400">
          선수 검색 기능 추가 예정
        </div>
      </section>

      <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl">
        저장
      </button>
    </div>
  );
}
