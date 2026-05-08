"use client";

import { useState } from "react";
import type { PlayerRecord } from "@/types";

const HITTERS: PlayerRecord[] = [
  { rank: 1, playerId: "p1", playerName: "김도영",  team: "KIA",  position: "3B", games: 37, avg: 0.372, hits: 51, homeRuns: 12, rbi: 35, stolenBases: 8 },
  { rank: 2, playerId: "p2", playerName: "이정후",  team: "키움", position: "CF", games: 36, avg: 0.358, hits: 48, homeRuns: 5,  rbi: 22, stolenBases: 12 },
  { rank: 3, playerId: "p3", playerName: "박동원",  team: "KIA",  position: "C",  games: 37, avg: 0.341, hits: 44, homeRuns: 8,  rbi: 28, stolenBases: 1 },
  { rank: 4, playerId: "p4", playerName: "구자욱",  team: "삼성", position: "LF", games: 37, avg: 0.335, hits: 53, homeRuns: 6,  rbi: 24, stolenBases: 3 },
  { rank: 5, playerId: "p5", playerName: "오지환",  team: "LG",  position: "SS", games: 36, avg: 0.322, hits: 42, homeRuns: 4,  rbi: 18, stolenBases: 6 },
  { rank: 6, playerId: "p6", playerName: "한유섬",  team: "SSG", position: "RF", games: 37, avg: 0.318, hits: 47, homeRuns: 10, rbi: 31, stolenBases: 2 },
  { rank: 7, playerId: "p7", playerName: "노시환",  team: "한화", position: "3B", games: 36, avg: 0.315, hits: 41, homeRuns: 14, rbi: 38, stolenBases: 1 },
  { rank: 8, playerId: "p8", playerName: "강백호",  team: "KT",  position: "1B", games: 36, avg: 0.308, hits: 40, homeRuns: 9,  rbi: 29, stolenBases: 0 },
];

const PITCHERS: PlayerRecord[] = [
  { rank: 1, playerId: "q1", playerName: "양현종",  team: "KIA",  position: "SP", games: 9,  era: 2.14, wins: 7, losses: 1, saves: 0, strikeouts: 68, innings: 63.1 },
  { rank: 2, playerId: "q2", playerName: "원태인",  team: "삼성", position: "SP", games: 8,  era: 2.48, wins: 6, losses: 2, saves: 0, strikeouts: 55, innings: 58.2 },
  { rank: 3, playerId: "q3", playerName: "케이시 켈리", team: "SSG", position: "SP", games: 9,  era: 2.67, wins: 6, losses: 1, saves: 0, strikeouts: 61, innings: 60.2 },
  { rank: 4, playerId: "q4", playerName: "최원태",  team: "LG",  position: "SP", games: 8,  era: 3.02, wins: 5, losses: 2, saves: 0, strikeouts: 49, innings: 56.2 },
  { rank: 5, playerId: "q5", playerName: "류현진",  team: "한화", position: "SP", games: 7,  era: 3.21, wins: 4, losses: 2, saves: 0, strikeouts: 42, innings: 50.1 },
];

export default function PlayerRecordsPage() {
  const [tab, setTab] = useState<"hitter" | "pitcher">("hitter");

  return (
    <div className="p-4 space-y-4">
      <div className="flex rounded-xl bg-gray-100 p-1">
        {(["hitter", "pitcher"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
            }`}
          >
            {t === "hitter" ? "타자" : "투수"}
          </button>
        ))}
      </div>

      {tab === "hitter" ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 text-xs text-gray-400 font-medium bg-gray-50 px-3 py-2">
            <span className="col-span-1">#</span>
            <span className="col-span-3">선수</span>
            <span className="col-span-2 text-center">타율</span>
            <span className="col-span-2 text-center">안타</span>
            <span className="col-span-2 text-center">홈런</span>
            <span className="col-span-2 text-center">타점</span>
          </div>
          {HITTERS.map((p, idx) => (
            <div
              key={p.playerId}
              className={`grid grid-cols-12 text-sm px-3 py-2.5 items-center ${
                idx < HITTERS.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              <span className="col-span-1 text-gray-400 text-xs">{p.rank}</span>
              <div className="col-span-3">
                <p className="font-semibold text-gray-900 text-xs">{p.playerName}</p>
                <p className="text-gray-400 text-xs">{p.team}</p>
              </div>
              <span className="col-span-2 text-center font-bold text-blue-600">{p.avg?.toFixed(3)}</span>
              <span className="col-span-2 text-center text-gray-700">{p.hits}</span>
              <span className="col-span-2 text-center text-gray-700">{p.homeRuns}</span>
              <span className="col-span-2 text-center text-gray-700">{p.rbi}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 text-xs text-gray-400 font-medium bg-gray-50 px-3 py-2">
            <span className="col-span-1">#</span>
            <span className="col-span-3">선수</span>
            <span className="col-span-2 text-center">ERA</span>
            <span className="col-span-2 text-center">승</span>
            <span className="col-span-2 text-center">패</span>
            <span className="col-span-2 text-center">K</span>
          </div>
          {PITCHERS.map((p, idx) => (
            <div
              key={p.playerId}
              className={`grid grid-cols-12 text-sm px-3 py-2.5 items-center ${
                idx < PITCHERS.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              <span className="col-span-1 text-gray-400 text-xs">{p.rank}</span>
              <div className="col-span-3">
                <p className="font-semibold text-gray-900 text-xs">{p.playerName}</p>
                <p className="text-gray-400 text-xs">{p.team}</p>
              </div>
              <span className="col-span-2 text-center font-bold text-green-600">{p.era?.toFixed(2)}</span>
              <span className="col-span-2 text-center text-blue-600 font-semibold">{p.wins}</span>
              <span className="col-span-2 text-center text-red-500 font-semibold">{p.losses}</span>
              <span className="col-span-2 text-center text-gray-700">{p.strikeouts}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 text-center">※ 샘플 데이터입니다</p>
    </div>
  );
}
