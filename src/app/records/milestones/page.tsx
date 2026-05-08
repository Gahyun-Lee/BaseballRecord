import type { PlayerMilestone } from "@/types";
import { TEAM_COLORS } from "@/utils/constants";
import { Trophy } from "lucide-react";

const MILESTONES: PlayerMilestone[] = [
  { playerId: "p1", playerName: "이승엽",  team: "삼성", category: "통산 홈런", target: 500, current: 467, remaining: 33, unit: "개" },
  { playerId: "p2", playerName: "이대호",  team: "롯데", category: "통산 안타", target: 2500, current: 2487, remaining: 13, unit: "개" },
  { playerId: "p3", playerName: "양현종",  team: "KIA",  category: "통산 탈삼진", target: 2000, current: 1942, remaining: 58, unit: "개" },
  { playerId: "p4", playerName: "박병호",  team: "KT",   category: "통산 홈런", target: 450, current: 434, remaining: 16, unit: "개" },
  { playerId: "p5", playerName: "나성범",  team: "KIA",  category: "통산 안타", target: 2000, current: 1899, remaining: 101, unit: "개" },
  { playerId: "p6", playerName: "최형우",  team: "KIA",  category: "통산 타점", target: 1500, current: 1466, remaining: 34, unit: "개" },
  { playerId: "p7", playerName: "손아섭",  team: "NC",   category: "통산 도루", target: 300, current: 292, remaining: 8, unit: "개" },
  { playerId: "p8", playerName: "류현진",  team: "한화", category: "통산 탈삼진", target: 1500, current: 1479, remaining: 21, unit: "개" },
];

function urgencyColor(remaining: number) {
  if (remaining <= 5)  return "text-red-600 bg-red-50 border-red-200";
  if (remaining <= 20) return "text-orange-600 bg-orange-50 border-orange-200";
  if (remaining <= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  return "text-gray-600 bg-gray-50 border-gray-200";
}

export default function MilestonesPage() {
  const sorted = [...MILESTONES].sort((a, b) => a.remaining - b.remaining);

  return (
    <div className="p-4 space-y-3">
      {sorted.map((m) => {
        const color = TEAM_COLORS[m.team];
        const pct = Math.round((m.current / m.target) * 100);
        const urgency = urgencyColor(m.remaining);

        return (
          <div key={`${m.playerId}-${m.category}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color.primary }} />
                  <span className="text-xs text-gray-400">{m.team}</span>
                </div>
                <p className="font-bold text-gray-900 mt-0.5">{m.playerName}</p>
                <p className="text-xs text-gray-500">{m.category} {m.target.toLocaleString()}{m.unit}</p>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-black ${urgency}`}>
                <Trophy size={12} />
                D-{m.remaining.toLocaleString()}{m.unit}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>{m.current.toLocaleString()}{m.unit}</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: color.primary }}
                />
              </div>
              <div className="text-right text-xs text-gray-400">{m.target.toLocaleString()}{m.unit}</div>
            </div>
          </div>
        );
      })}
      <p className="text-xs text-gray-400 text-center mt-2">※ 샘플 데이터입니다</p>
    </div>
  );
}
