import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PlusCircle, MapPin } from "lucide-react";
import Link from "next/link";

export default async function ObservationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">나의 직관 기록</p>
        <Link
          href="/mypage/observations/new"
          className="flex items-center gap-1.5 text-sm text-navy-600 font-semibold"
        >
          <PlusCircle size={16} />
          기록 추가
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <MapPin size={28} className="text-gray-300" />
        </div>
        <div>
          <p className="font-semibold text-gray-700">아직 직관 기록이 없어요</p>
          <p className="text-sm text-gray-400 mt-1">경기장에서 직접 관람한 기록을 남겨보세요</p>
        </div>
        <Link
          href="/mypage/observations/new"
          className="bg-navy-600 text-white text-sm font-bold px-6 py-2.5 rounded-2xl"
        >
          첫 직관 기록 남기기
        </Link>
      </div>
    </div>
  );
}
