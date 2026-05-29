import { useState, useEffect, useMemo, useRef } from "react";
import { Check, X, Search } from "lucide-react";
import { KBO_TEAMS, TEAM_LOGOS, TEAM_COLORS } from "@/utils/constants";
import type { KboTeam } from "@/types";

interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  back_number: string;
}

interface FavoritePlayer {
  id: number;
  name: string;
  team: string;
}

interface SignupStep3Props {
  favoriteTeam: KboTeam | null;
  setFavoriteTeam: (v: KboTeam | null) => void;
  favoritePlayers: FavoritePlayer[];
  setFavoritePlayers: (v: FavoritePlayer[]) => void;
  error: string | null;
  loading: boolean;
  onSubmit: () => void;
  onPrev: () => void;
}

export default function SignupStep3({
  favoriteTeam, setFavoriteTeam,
  favoritePlayers, setFavoritePlayers,
  error, loading, onSubmit, onPrev,
}: SignupStep3Props) {
  const [playerSearch, setPlayerSearch] = useState("");
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [fetchError, setFetchError] = useState(false);
  const [selectedTeamTab, setSelectedTeamTab] = useState<KboTeam | null>(null);
  const fetched = useRef(false);

  function fetchPlayers() {
    setFetchError(false);
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setAllPlayers(data); else setFetchError(true); })
      .catch(() => setFetchError(true));
  }

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchPlayers();
  }, []);

  useEffect(() => {
    setSelectedTeamTab(favoriteTeam);
  }, [favoriteTeam]);

  const sortedTeams = useMemo(() => {
    if (!favoriteTeam) return KBO_TEAMS;
    return [favoriteTeam, ...KBO_TEAMS.filter((t) => t !== favoriteTeam)];
  }, [favoriteTeam]);

  const filteredPlayers = useMemo(() => {
    let list = allPlayers;
    if (selectedTeamTab) list = list.filter((p) => p.team === selectedTeamTab);
    if (playerSearch.trim()) list = list.filter((p) => p.name.includes(playerSearch.trim()));
    return list;
  }, [allPlayers, selectedTeamTab, playerSearch]);

  function togglePlayer(id: number, name: string, team: string) {
    if (favoritePlayers.some((p) => p.id === id)) {
      setFavoritePlayers(favoritePlayers.filter((p) => p.id !== id));
    } else {
      setFavoritePlayers([...favoritePlayers, { id, name, team }]);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">최애 팀 <span className="text-gray-400 font-normal">(선택)</span></p>
        <div className="grid grid-cols-5 gap-2">
          {KBO_TEAMS.map((team) => (
            <button key={team} type="button" onClick={() => setFavoriteTeam(favoriteTeam === team ? null : team)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all"
              style={favoriteTeam === team
                ? { borderColor: TEAM_COLORS[team].primary, backgroundColor: `${TEAM_COLORS[team].primary}10` }
                : { borderColor: "#f3f4f6", backgroundColor: "white" }}>
              <img src={TEAM_LOGOS[team]} alt={team} className="w-8 h-8 object-contain" />
              <span className="text-[10px] font-semibold text-gray-700">{team}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">최애 선수 <span className="text-gray-400 font-normal">(선택, 여러 명 가능)</span></p>
        {favoritePlayers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {favoritePlayers.map((p) => {
              const teamColor = TEAM_COLORS[p.team as KboTeam]?.primary || "#041E42";
              return (
                <span key={p.id} className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full"
                  style={{ backgroundColor: `${teamColor}20`, color: teamColor }}>
                  {p.name}
                  <button type="button" onClick={() => togglePlayer(p.id, p.name, p.team)}><X size={12} /></button>
                </span>
              );
            })}
          </div>
        )}
        <div className="relative mb-2">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="선수 이름 검색" value={playerSearch}
            onChange={(e) => setPlayerSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const first = filteredPlayers[0]; if (first) { togglePlayer(first.id, first.name, first.team); setPlayerSearch(""); } } }}
            className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 mb-2 scrollbar-hide">
          <button type="button" onClick={() => setSelectedTeamTab(null)}
            className="shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors"
            style={!selectedTeamTab
              ? { backgroundColor: favoriteTeam ? TEAM_COLORS[favoriteTeam].primary : "#041E42", color: "white" }
              : { backgroundColor: "#f3f4f6", color: "#6b7280" }}>
            전체
          </button>
          {sortedTeams.map((team) => (
            <button key={team} type="button" onClick={() => setSelectedTeamTab(selectedTeamTab === team ? null : team)}
              className="shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors"
              style={selectedTeamTab === team
                ? { backgroundColor: TEAM_COLORS[team].primary, color: "white" }
                : { backgroundColor: "#f3f4f6", color: "#6b7280" }}>
              {team}
            </button>
          ))}
        </div>
        <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-200">
          {filteredPlayers.length === 0 ? (
            <div className="text-xs text-gray-400 text-center py-6">
              {fetchError ? (
                <div className="space-y-2">
                  <p>선수 목록을 불러오지 못했습니다.</p>
                  <button type="button" onClick={fetchPlayers}
                    className="text-navy-600 font-semibold">다시 시도</button>
                </div>
              ) : allPlayers.length === 0 ? "선수 목록을 불러오는 중..." : "검색 결과가 없습니다"}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredPlayers.map((p) => {
                const selected = favoritePlayers.some((fp) => fp.id === p.id);
                const playerTeamColor = TEAM_COLORS[p.team as KboTeam]?.primary || "#041E42";
                return (
                  <button key={p.id} type="button" onClick={() => togglePlayer(p.id, p.name, p.team)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left transition-colors hover:bg-gray-50"
                    style={selected ? { backgroundColor: `${playerTeamColor}10` } : undefined}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-6 text-right">{p.back_number}</span>
                      <span className="text-xs font-semibold text-gray-800">{p.name}</span>
                      <span className="text-[10px] text-gray-400">{p.team} · {p.position}</span>
                    </div>
                    {selected && <Check size={14} className="shrink-0" style={{ color: playerTeamColor }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={onPrev}
          className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500">
          이전
        </button>
        <button type="button" onClick={onSubmit} disabled={loading}
          className="flex-[2] bg-navy-600 text-white font-bold py-3 rounded-2xl disabled:opacity-50">
          {loading ? "처리 중..." : "가입 완료"}
        </button>
      </div>
    </div>
  );
}
