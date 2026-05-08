import Link from "next/link";
import { STADIUMS, TEAM_COLORS } from "@/utils/constants";
import { MapPin, Users } from "lucide-react";

export default function StadiumsPage() {
  return (
    <div className="p-4 space-y-3">
      {STADIUMS.map((stadium) => {
        const color = TEAM_COLORS[stadium.team];
        return (
          <Link
            key={stadium.id}
            href={`/stadiums/${stadium.id}`}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:bg-gray-50 transition-colors"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: color.primary }}
            >
              {stadium.team}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{stadium.name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={11} />
                  {stadium.address.split(" ").slice(0, 2).join(" ")}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Users size={11} />
                  {stadium.capacity.toLocaleString()}석
                </span>
              </div>
            </div>
            <div className="text-gray-300 text-lg">›</div>
          </Link>
        );
      })}
    </div>
  );
}
