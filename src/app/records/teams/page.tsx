import type { TeamRecord } from "@/types";
import { TEAM_COLORS } from "@/utils/constants";

const SAMPLE_RECORDS: TeamRecord[] = [
  { rank: 1, team: "KIA",  games: 37, wins: 25, losses: 11, draws: 1, winRate: 0.694, gamesBehind: 0,   homeWins: 13, awayWins: 12, streak: "5연승", last10: "8-2" },
  { rank: 2, team: "삼성",  games: 37, wins: 22, losses: 15, draws: 0, winRate: 0.595, gamesBehind: 3.5, homeWins: 11, awayWins: 11, streak: "2연승", last10: "6-4" },
  { rank: 3, team: "LG",   games: 36, wins: 20, losses: 15, draws: 1, winRate: 0.571, gamesBehind: 4.5, homeWins: 10, awayWins: 10, streak: "1연패", last10: "5-5" },
  { rank: 4, team: "SSG",  games: 37, wins: 19, losses: 17, draws: 1, winRate: 0.528, gamesBehind: 6,   homeWins: 10, awayWins: 9,  streak: "1연승", last10: "6-4" },
  { rank: 5, team: "두산",  games: 37, wins: 18, losses: 18, draws: 1, winRate: 0.500, gamesBehind: 7,   homeWins: 9,  awayWins: 9,  streak: "3연패", last10: "4-6" },
  { rank: 6, team: "KT",   games: 36, wins: 17, losses: 18, draws: 1, winRate: 0.486, gamesBehind: 7.5, homeWins: 8,  awayWins: 9,  streak: "1연패", last10: "5-5" },
  { rank: 7, team: "롯데",  games: 37, wins: 16, losses: 20, draws: 1, winRate: 0.444, gamesBehind: 9,   homeWins: 8,  awayWins: 8,  streak: "2연패", last10: "4-6" },
  { rank: 8, team: "NC",   games: 37, wins: 14, losses: 22, draws: 1, winRate: 0.389, gamesBehind: 11,  homeWins: 7,  awayWins: 7,  streak: "1연패", last10: "4-6" },
  { rank: 9, team: "한화",  games: 36, wins: 13, losses: 22, draws: 1, winRate: 0.371, gamesBehind: 12,  homeWins: 6,  awayWins: 7,  streak: "3연패", last10: "3-7" },
  { rank: 10, team: "키움", games: 37, wins: 11, losses: 25, draws: 1, winRate: 0.306, gamesBehind: 14,  homeWins: 5,  awayWins: 6,  streak: "2연패", last10: "2-8" },
];

export default function TeamRecordsPage() {
  return (
    <div className="p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-8 text-xs text-gray-400 font-medium bg-gray-50 px-3 py-2">
          <span className="col-span-1 text-center">순위</span>
          <span className="col-span-2">팀</span>
          <span className="col-span-1 text-center">경기</span>
          <span className="col-span-1 text-center">승</span>
          <span className="col-span-1 text-center">패</span>
          <span className="col-span-1 text-center">승률</span>
          <span className="col-span-1 text-center">GB</span>
        </div>
        {SAMPLE_RECORDS.map((record, idx) => {
          const color = TEAM_COLORS[record.team];
          const isTop5 = record.rank <= 5;
          return (
            <div
              key={record.team}
              className={`grid grid-cols-8 text-sm px-3 py-2.5 items-center ${
                idx < SAMPLE_RECORDS.length - 1 ? "border-b border-gray-50" : ""
              } ${isTop5 ? "bg-white" : "bg-gray-50/50"}`}
            >
              <span className={`col-span-1 text-center font-bold ${record.rank <= 3 ? "text-yellow-500" : "text-gray-400"}`}>
                {record.rank}
              </span>
              <div className="col-span-2 flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color.primary }}
                />
                <span className="font-semibold text-gray-900">{record.team}</span>
              </div>
              <span className="col-span-1 text-center text-gray-600">{record.games}</span>
              <span className="col-span-1 text-center text-blue-600 font-semibold">{record.wins}</span>
              <span className="col-span-1 text-center text-red-500 font-semibold">{record.losses}</span>
              <span className="col-span-1 text-center text-gray-700 font-semibold">{record.winRate.toFixed(3)}</span>
              <span className="col-span-1 text-center text-gray-400 text-xs">
                {record.gamesBehind === 0 ? "-" : record.gamesBehind}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 text-center mt-3">※ 샘플 데이터입니다</p>
    </div>
  );
}
