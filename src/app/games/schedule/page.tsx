import { TEAM_COLORS } from "@/utils/constants";
import type { KboTeam, Game } from "@/types";

const SAMPLE_GAMES: Game[] = [
  {
    id: "1",
    date: "2026-05-08",
    time: "18:30",
    homeTeam: "LG",
    awayTeam: "두산",
    stadium: "잠실야구장",
    status: "scheduled",
    ticketUrl: "https://ticket.interpark.com",
  },
  {
    id: "2",
    date: "2026-05-08",
    time: "18:30",
    homeTeam: "KIA",
    awayTeam: "삼성",
    stadium: "광주-기아 챔피언스 필드",
    status: "live",
    homeScore: 3,
    awayScore: 1,
    inning: "7회초",
  },
  {
    id: "3",
    date: "2026-05-08",
    time: "18:30",
    homeTeam: "SSG",
    awayTeam: "롯데",
    stadium: "인천SSG랜더스필드",
    status: "final",
    homeScore: 5,
    awayScore: 3,
  },
  {
    id: "4",
    date: "2026-05-09",
    time: "18:30",
    homeTeam: "한화",
    awayTeam: "KT",
    stadium: "한화생명 이글스파크",
    status: "scheduled",
  },
  {
    id: "5",
    date: "2026-05-09",
    time: "14:00",
    homeTeam: "NC",
    awayTeam: "키움",
    stadium: "창원NC파크",
    status: "scheduled",
  },
];

const STATUS_BADGE: Record<Game["status"], string> = {
  scheduled: "text-gray-500 bg-gray-100",
  live:       "text-red-600 bg-red-100 animate-pulse",
  final:      "text-gray-400 bg-gray-50",
  cancelled:  "text-gray-300 bg-gray-50",
};

const STATUS_LABEL: Record<Game["status"], string> = {
  scheduled: "예정",
  live:      "LIVE",
  final:     "종료",
  cancelled: "취소",
};

function TeamName({ team }: { team: KboTeam }) {
  const color = TEAM_COLORS[team].text;
  return <span className={`font-bold text-sm ${color}`}>{team}</span>;
}

function GameCard({ game }: { game: Game }) {
  const isLive = game.status === "live";
  const isFinal = game.status === "final";

  return (
    <div className={`bg-white rounded-2xl border p-4 space-y-2 ${isLive ? "border-red-200 shadow-md" : "border-gray-100 shadow-sm"}`}>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{game.stadium}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[game.status]}`}>
          {isLive ? game.inning : STATUS_LABEL[game.status]}
        </span>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="flex-1 text-right">
          <TeamName team={game.awayTeam} />
          {(isLive || isFinal) && (
            <p className={`text-2xl font-black mt-1 ${game.awayScore! < game.homeScore! ? "text-gray-300" : "text-gray-900"}`}>
              {game.awayScore}
            </p>
          )}
        </div>
        <div className="text-gray-300 font-bold">
          {isLive || isFinal ? ":" : game.time}
        </div>
        <div className="flex-1 text-left">
          <TeamName team={game.homeTeam} />
          {(isLive || isFinal) && (
            <p className={`text-2xl font-black mt-1 ${game.homeScore! < game.awayScore! ? "text-gray-300" : "text-gray-900"}`}>
              {game.homeScore}
            </p>
          )}
        </div>
      </div>
      {game.ticketUrl && game.status === "scheduled" && (
        <a
          href={game.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-xs text-blue-600 font-semibold py-1.5 border border-blue-200 rounded-lg mt-1 hover:bg-blue-50 transition-colors"
        >
          티켓 예매
        </a>
      )}
    </div>
  );
}

export default function SchedulePage() {
  const grouped = SAMPLE_GAMES.reduce<Record<string, Game[]>>((acc, game) => {
    (acc[game.date] ??= []).push(game);
    return acc;
  }, {});

  return (
    <div className="p-4 space-y-6">
      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, games]) => (
          <section key={date}>
            <h2 className="text-sm font-semibold text-gray-500 mb-2">
              {new Date(date).toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
                weekday: "short",
              })}
            </h2>
            <div className="space-y-3">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
