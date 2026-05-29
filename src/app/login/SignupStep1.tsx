import { useRef } from "react";
import { smoothScrollTo } from "@/utils/smoothScroll";

interface SignupStep1Props {
  agreeTerms: boolean;
  setAgreeTerms: (v: boolean) => void;
  agreePrivacy: boolean;
  setAgreePrivacy: (v: boolean) => void;
  error: string | null;
  onNext: () => void;
}

export default function SignupStep1({
  agreeTerms, setAgreeTerms, agreePrivacy, setAgreePrivacy, error, onNext,
}: SignupStep1Props) {
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  function handleAllAgree(checked: boolean) {
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
    if (checked && nextButtonRef.current) {
      const target = nextButtonRef.current.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2;
      smoothScrollTo(target, 450).then(() => {
        nextButtonRef.current?.focus({ preventScroll: true });
      });
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-700 mb-3">서비스 이용을 위해 약관에 동의해주세요</p>
      <label className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 cursor-pointer active:bg-gray-50">
        <input type="checkbox" checked={agreeTerms && agreePrivacy}
          onChange={(e) => handleAllAgree(e.target.checked)}
          className="w-4 h-4 rounded accent-navy-600" />
        <span className="text-sm font-bold text-gray-800">전체 동의</span>
      </label>
      <div className="space-y-2 pl-1">
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-1">[필수] 서비스 이용약관</p>
          <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 leading-relaxed space-y-2 max-h-32 overflow-y-auto">
            <p><strong>제1조(목적)</strong> 본 약관은 KBO 야구 서비스(이하 &quot;서비스&quot;)가 제공하는 경기 기록 및 직관 기록 관리 서비스의 이용조건과 절차, 이용자와 서비스의 권리·의무·책임사항을 규정함을 목적으로 합니다.</p>
            <p><strong>제2조(약관의 효력 및 변경)</strong> 본 약관은 서비스 화면에 게시함으로써 효력이 발생하며, 관련 법령의 범위 내에서 개정될 수 있습니다. 약관 변경 시 적용일 7일 전부터 공지하며, 변경 후에도 계속 서비스를 이용하는 경우 변경된 약관에 동의한 것으로 간주합니다.</p>
            <p><strong>제3조(회원가입 및 탈퇴)</strong> 회원가입은 이용자가 약관에 동의하고 가입 신청을 완료함으로써 성립합니다. 회원은 언제든지 탈퇴를 신청할 수 있으며, 탈퇴 시 개인정보는 지체 없이 파기됩니다.</p>
            <p><strong>제4조(이용자의 의무)</strong> 이용자는 타인의 정보를 도용하거나 허위 정보를 기재해서는 안 됩니다. 서비스를 이용하여 법령 또는 본 약관이 금지하는 행위를 해서는 안 되며, 위반 시 서비스 이용이 제한될 수 있습니다.</p>
            <p><strong>제5조(서비스 제공 및 중단)</strong> 서비스는 연중무휴 24시간 제공을 원칙으로 하나, 시스템 점검·장애·천재지변 등 불가피한 사유로 일시 중단될 수 있습니다.</p>
            <p><strong>제6조(면책)</strong> 서비스는 무료로 제공되며, 서비스 이용 중 발생한 손해에 대해 고의 또는 중과실이 없는 한 책임을 지지 않습니다.</p>
          </div>
          <label className="flex items-center justify-end gap-2 cursor-pointer mt-1.5">
            <span className="text-xs text-gray-500">위 이용약관 내용을 읽고 동의합니다.</span>
            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded accent-navy-600 shrink-0" />
          </label>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-1">[필수] 개인정보 처리방침</p>
          <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 leading-relaxed space-y-2 max-h-32 overflow-y-auto">
            <p><strong>1. 수집하는 개인정보 항목</strong><br />· 필수: 이메일, 닉네임<br />· 선택: 최애 팀, 최애 선수<br />· 자동 수집: 접속 로그, IP 주소, 서비스 이용 기록</p>
            <p><strong>2. 수집 목적</strong><br />· 회원 식별 및 서비스 제공<br />· 직관 기록 저장 및 관리<br />· 서비스 개선 및 신규 기능 개발<br />· 민원 처리 및 고지사항 전달</p>
            <p><strong>3. 보유 및 이용 기간</strong><br />수집·이용 목적 달성 후 지체 없이 파기합니다. 단, 최종 로그인 후 2년이 경과하거나 회원 탈퇴 신청 시 즉시 파기합니다.</p>
            <p><strong>4. 동의 거부 권리</strong><br />이용자는 개인정보 수집·이용에 동의를 거부할 권리가 있습니다. 단, 필수 항목에 동의하지 않을 경우 서비스 이용이 제한됩니다.</p>
          </div>
          <label className="flex items-center justify-end gap-2 cursor-pointer mt-1.5">
            <span className="text-xs text-gray-500">위 개인정보 처리방침 내용을 읽고 동의합니다.</span>
            <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)}
              className="w-4 h-4 rounded accent-navy-600 shrink-0" />
          </label>
        </div>
      </div>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      <button ref={nextButtonRef} type="button" onClick={onNext}
        className="w-full bg-navy-600 text-white font-bold py-3 rounded-2xl mt-2">
        다음
      </button>
    </div>
  );
}
