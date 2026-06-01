import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FavoritesForm from "./FavoritesForm";
import type { KboTeam } from "@/types";

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("favorite_team, favorite_players")
    .eq("id", user.id)
    .single();

  const favoriteTeam = (profile?.favorite_team as KboTeam) || null;
  const playerIds: number[] = profile?.favorite_players || [];

  let initialPlayers: { id: number; name: string; team: string }[] = [];
  if (playerIds.length > 0) {
    const { data } = await supabase
      .from("players")
      .select("id, name, team")
      .in("id", playerIds);
    if (data) initialPlayers = data;
  }

  return <FavoritesForm initialTeam={favoriteTeam} initialPlayers={initialPlayers} />;
}
