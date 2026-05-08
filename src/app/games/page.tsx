import { Calendar, Tv, Ticket } from "lucide-react";
import Link from "next/link";

const tabs = [
  { href: "/games/schedule", icon: Calendar, label: "시즌 일정" },
  { href: "/games/live",     icon: Tv,       label: "실시간" },
  { href: "/games/tickets",  icon: Ticket,   label: "티켓 예매" },
];

export default function GamesPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="grid gap-3">
        {tabs.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm active:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Icon size={20} className="text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
