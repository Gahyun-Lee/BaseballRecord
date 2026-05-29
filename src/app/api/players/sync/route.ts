import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

const KBO_SEARCH_URL = "https://www.koreabaseball.com/Player/Search.aspx";

const TEAM_CODES = ["SS", "LG", "KT", "HT", "HH", "OB", "SK", "NC", "LT", "WO"];
const TEAM_CODE_TO_NAME: Record<string, string> = {
  SS: "삼성", LG: "LG", KT: "KT", HT: "KIA", HH: "한화",
  OB: "두산", SK: "SSG", NC: "NC", LT: "롯데", WO: "키움",
};

interface Player {
  name: string;
  team: string;
  position: string;
  back_number: string;
  player_id: string;
}

async function getInitialFormData(): Promise<Record<string, string>> {
  const res = await fetch(KBO_SEARCH_URL);
  const html = await res.text();
  const $ = cheerio.load(html);
  return {
    __VIEWSTATE: $("#__VIEWSTATE").val() as string,
    __VIEWSTATEGENERATOR: $("#__VIEWSTATEGENERATOR").val() as string,
    __EVENTVALIDATION: $("#__EVENTVALIDATION").val() as string,
  };
}

function parsePlayers(html: string, teamCode: string): { players: Player[]; totalCount: number; formData: Record<string, string> } {
  const $ = cheerio.load(html);
  const players: Player[] = [];
  const teamName = TEAM_CODE_TO_NAME[teamCode];

  const countText = $("p.title .point").text().trim();
  const totalCount = parseInt(countText) || 0;

  $("tbody tr").each((_, row) => {
    const tds = $(row).find("td");
    if (tds.length < 4) return;

    const backNumber = $(tds[0]).text().trim();
    const nameLink = $(tds[1]).find("a");
    const name = nameLink.text().trim();
    const href = nameLink.attr("href") || "";
    const playerIdMatch = href.match(/playerId=(\d+)/);
    const playerId = playerIdMatch ? playerIdMatch[1] : "";
    const position = $(tds[3]).text().trim();

    if (name && position && playerId && !["감독", "코치"].includes(position)) {
      players.push({ name, team: teamName, position, back_number: backNumber, player_id: playerId });
    }
  });

  return {
    players,
    totalCount,
    formData: {
      __VIEWSTATE: $("#__VIEWSTATE").val() as string,
      __VIEWSTATEGENERATOR: $("#__VIEWSTATEGENERATOR").val() as string,
      __EVENTVALIDATION: $("#__EVENTVALIDATION").val() as string,
    },
  };
}

async function fetchTeamPlayers(teamCode: string, formData: Record<string, string>): Promise<{ players: Player[]; lastFormData: Record<string, string> }> {
  const body = new URLSearchParams({
    ...formData,
    __EVENTTARGET: "ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlTeam",
    __EVENTARGUMENT: "",
    "ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlTeam": teamCode,
    "ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlPosition": "",
    "ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$txtSearch": "",
  });

  const res = await fetch(KBO_SEARCH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const html = await res.text();
  const firstPage = parsePlayers(html, teamCode);
  const allPlayers = [...firstPage.players];
  let currentFormData = firstPage.formData;

  const totalPages = Math.ceil(firstPage.totalCount / 20);
  for (let page = 2; page <= totalPages; page++) {
    const pageBody = new URLSearchParams({
      ...currentFormData,
      __EVENTTARGET: `ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ucPager$btnNo${page}`,
      __EVENTARGUMENT: "",
      "ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlTeam": teamCode,
      "ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlPosition": "",
      "ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$txtSearch": "",
    });

    const pageRes = await fetch(KBO_SEARCH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: pageBody.toString(),
    });
    const pageHtml = await pageRes.text();
    const pageResult = parsePlayers(pageHtml, teamCode);
    allPlayers.push(...pageResult.players);
    currentFormData = pageResult.formData;
  }

  return { players: allPlayers, lastFormData: currentFormData };
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`;
  const a = Buffer.from(authHeader);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const allPlayers: Player[] = [];

  for (const teamCode of TEAM_CODES) {
    const formData = await getInitialFormData();
    const result = await fetchTeamPlayers(teamCode, formData);
    allPlayers.push(...result.players);
  }

  if (allPlayers.length === 0) {
    return NextResponse.json({ error: "선수 데이터를 파싱할 수 없습니다" }, { status: 500 });
  }

  for (let i = 0; i < allPlayers.length; i += 500) {
    const batch = allPlayers.slice(i, i + 500);
    const { error: upsertError } = await supabaseAdmin.from("players").upsert(
      batch.map((p) => ({ ...p, updated_at: new Date().toISOString() })),
      { onConflict: "player_id" }
    );
    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, count: allPlayers.length });
}
