export type KboTeam =
  | "KIA"
  | "삼성"
  | "LG"
  | "두산"
  | "KT"
  | "SSG"
  | "롯데"
  | "한화"
  | "NC"
  | "키움";

export interface Game {
  id: string;
  date: string;
  time: string;
  homeTeam: KboTeam;
  awayTeam: KboTeam;
  homeScore?: number;
  awayScore?: number;
  stadium: string;
  status: "scheduled" | "live" | "final" | "cancelled";
  inning?: string;
  ticketUrl?: string;
}

export interface TeamRecord {
  rank: number;
  team: KboTeam;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  gamesBehind: number;
  homeWins: number;
  awayWins: number;
  streak: string;
  last10: string;
}

export interface PlayerRecord {
  rank: number;
  playerId: string;
  playerName: string;
  team: KboTeam;
  position: string;
  games: number;
  avg?: number;
  hits?: number;
  homeRuns?: number;
  rbi?: number;
  stolenBases?: number;
  era?: number;
  wins?: number;
  losses?: number;
  saves?: number;
  strikeouts?: number;
  innings?: number;
}

export interface PlayerMilestone {
  playerId: string;
  playerName: string;
  team: KboTeam;
  category: string;
  target: number;
  current: number;
  remaining: number;
  unit: string;
}

export interface Stadium {
  id: string;
  name: string;
  team: KboTeam;
  address: string;
  lat: number;
  lng: number;
  capacity: number;
  openYear: number;
  imageUrl?: string;
  mapUrl?: string;
  officialUrl?: string;
}

export interface StadiumWeather {
  stadiumId: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  updatedAt: string;
}

export interface TeamEvent {
  id: string;
  team: KboTeam;
  title: string;
  description: string;
  date: string;
  category: "uniform" | "special" | "fanEvent" | "other";
  imageUrl?: string;
}

export interface DirectObservation {
  id: string;
  userId: string;
  gameDate: string;
  homeTeam: KboTeam;
  awayTeam: KboTeam;
  stadium: string;
  seat?: string;
  homeScore?: number;
  awayScore?: number;
  memo?: string;
  imageUrls?: string[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  favoriteTeam?: KboTeam;
  favoritePlayers?: string[];
  createdAt: string;
}
