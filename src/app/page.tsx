import Link from "next/link";
import { Calendar, BarChart2, MapPin, User } from "lucide-react";

const sections = [
  {
    href: "/games",
    icon: Calendar,
    title: "경기",
    description: "KBO 일정 · 실시간 스코어 · 티켓 예매",
    color: "bg-blue-500",
  },
  {
    href: "/records",
    icon: BarChart2,
    title: "기록",
    description: "팀 기록 · 선수 기록 · 기록 달성 카운트다운",
    color: "bg-green-500",
  },
  {
    href: "/stadiums",
    icon: MapPin,
    title: "구장",
    description: "구장 정보 · 날씨 · 음식 · 이벤트",
    color: "bg-orange-500",
  },
  {
    href: "/mypage",
    icon: User,
    title: "내 정보",
    description: "직관 기록 · 최애 팀/선수 설정",
    color: "bg-purple-500",
  },
];

export default function Home() {
  return (
    <div className="p-4 space-y-4">
      <div className="pt-4 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">KBO 야구</h1>
        <p className="text-sm text-gray-500 mt-1">2026 시즌</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sections.map(({ href, icon: Icon, title, description, color }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm active:scale-95 transition-transform"
          >
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{title}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
