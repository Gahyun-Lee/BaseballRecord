"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/games":           "경기 일정",
  "/records":         "기록",
  "/records/teams":   "팀 기록",
  "/records/players": "선수 기록",
  "/stadiums":        "구장 정보",
  "/mypage":          "내 정보",
  "/login":           "로그인",
};

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "KBO 야구";
  const isRoot = pathname === "/";
  const isSubPage = Object.keys(pageTitles).some(
    (k) => k !== pathname && pathname.startsWith(k) && k !== "/"
  );

  if (isRoot) return null;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-lg mx-auto flex items-center h-14 px-4">
        {isSubPage && (
          <Link href={pathname.split("/").slice(0, -1).join("/") || "/"} className="mr-2 text-gray-500">
            <ChevronLeft size={24} />
          </Link>
        )}
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
      </div>
    </header>
  );
}
