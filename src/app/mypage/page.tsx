import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogIn, Heart, BookOpen, ChevronRight } from "lucide-react";

export default async function MyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
          <LogIn size={32} className="text-gray-400" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">로그인이 필요해요</p>
          <p className="text-sm text-gray-400 mt-1">직관 기록을 저장하고<br />최애 팀·선수를 설정해보세요</p>
        </div>
        <Link
          href="/login"
          className="w-full max-w-xs bg-blue-600 text-white font-bold py-3 rounded-2xl text-center"
        >
          로그인 / 회원가입
        </Link>
      </div>
    );
  }

  const menuItems = [
    { href: "/mypage/observations", icon: BookOpen, label: "직관 기록", desc: "경기 직접 관람 기록 관리" },
    { href: "/mypage/favorites",    icon: Heart,    label: "최애 팀/선수", desc: "응원하는 팀과 선수 설정" },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-bold text-lg">
            {user.email?.[0].toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-bold text-gray-900">{user.email}</p>
          <p className="text-xs text-gray-400">KBO 야구 팬</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {menuItems.map(({ href, icon: Icon, label, desc }, idx) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-4 p-4 active:bg-gray-50 transition-colors ${
              idx < menuItems.length - 1 ? "border-b border-gray-50" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Icon size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </Link>
        ))}
      </div>

      <form action="/api/auth/signout" method="POST">
        <button
          type="submit"
          className="w-full py-3 rounded-2xl border border-gray-200 text-gray-500 text-sm font-semibold"
        >
          로그아웃
        </button>
      </form>
    </div>
  );
}
