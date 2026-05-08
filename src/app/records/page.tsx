import Link from "next/link";
import { Users, User, Trophy } from "lucide-react";

const tabs = [
  { href: "/records/teams",      icon: Users,  label: "팀 기록",     desc: "순위표 · 안타 · 홈런 · ERA" },
  { href: "/records/players",    icon: User,   label: "선수 기록",   desc: "타자 · 투수 스탯" },
  { href: "/records/milestones", icon: Trophy, label: "기록 카운트다운", desc: "기록 달성까지 D-N개" },
];

export default function RecordsPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="grid gap-3">
        {tabs.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm active:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Icon size={20} className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
