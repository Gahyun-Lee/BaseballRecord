import { notFound } from "next/navigation";
import { STADIUMS, TEAM_COLORS } from "@/utils/constants";
import { MapPin, Users, Calendar, Cloud, Utensils, Star } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StadiumDetailPage({ params }: Props) {
  const { id } = await params;
  const stadium = STADIUMS.find((s) => s.id === id);
  if (!stadium) notFound();

  const color = TEAM_COLORS[stadium.team];

  return (
    <div className="pb-4">
      <div className="h-36 flex items-end p-4" style={{ backgroundColor: color.primary }}>
        <div>
          <p className="text-white/70 text-sm">{stadium.team}</p>
          <h2 className="text-white font-black text-xl leading-tight">{stadium.name}</h2>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <h3 className="font-bold text-gray-900">구장 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{stadium.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users size={16} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-700">수용 인원 {stadium.capacity.toLocaleString()}명</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-700">{stadium.openYear}년 개장</span>
            </div>
          </div>
          {stadium.officialUrl && (
            <a
              href={stadium.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm font-semibold py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              공식 홈페이지
            </a>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Cloud size={16} className="text-blue-500" />
            <h3 className="font-bold text-gray-900">실시간 날씨</h3>
            <span className="text-xs text-gray-400 ml-auto">업데이트 예정</span>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-blue-400 text-sm">날씨 API 연동 후 표시됩니다</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Utensils size={16} className="text-orange-500" />
            <h3 className="font-bold text-gray-900">구장 내 음식</h3>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <p className="text-orange-400 text-sm">음식점 정보 추가 예정</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} className="text-yellow-500" />
            <h3 className="font-bold text-gray-900">팀 이벤트</h3>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3 text-center">
            <p className="text-yellow-600 text-sm">이벤트 정보 추가 예정</p>
          </div>
        </div>
      </div>
    </div>
  );
}
