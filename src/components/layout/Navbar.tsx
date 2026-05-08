"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, BarChart2, MapPin, User } from "lucide-react";

const navItems = [
  { href: "/games",    label: "경기",   icon: Calendar },
  { href: "/records",  label: "기록",   icon: BarChart2 },
  { href: "/stadiums", label: "구장",   icon: MapPin },
  { href: "/mypage",   label: "내 정보", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="max-w-lg mx-auto flex">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={isActive ? "font-semibold" : ""}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
