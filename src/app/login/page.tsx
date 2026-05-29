"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, Check, X, Plus } from "lucide-react";
import { KBO_TEAMS, TEAM_LOGOS, TEAM_COLORS } from "@/utils/constants";
import type { KboTeam } from "@/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_RULES = [
  { label: "8자 이상", test: (p: string) => p.length >= 8 },
  { label: "대문자 포함", test: (p: string) => /[A-Z]/.test(p) },
  { label: "숫자 포함", test: (p: string) => /[0-9]/.test(p) },
  { label: "특수문자 포함", test: (p: string) => /[!@#$%^&*]/.test(p) },
];

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
            s < step ? "bg-blue-600 text-white" :
            s === step ? "bg-blue-600 text-white ring-4 ring-blue-100" :
            "bg-gray-100 text-gray-400"
          }`}>
            {s < step ? <Check size={14} /> : s}
          </div>
          {s < 3 && (
            <div className={`w-12 h-0.5 transition-colors duration-300 ${s < step ? "bg-blue-600" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1);

  // 공통
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Step 2 - 회원정보
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);

  // Step 1 - 약관
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Step 3 - 최애 팀/선수
  const [favoriteTeam, setFavoriteTeam] = useState<KboTeam | null>(null);
  const [playerInput, setPlayerInput] = useState("");
  const [favoritePlayers, setFavoritePlayers] = useState<string[]>([]);

  const router = useRouter();
  const supabase = createClient();

  function handleToggle() {
    setIsSignUp(!isSignUp);
    setStep(1);
    setError(null);
    setUsername(""); setEmail(""); setPassword(""); setConfirmPassword("");
    setEmailChecked(false); setEmailTaken(false);
    setAgreeTerms(false); setAgreePrivacy(false);
    setFavoriteTeam(null); setFavoritePlayers([]);
  }

  async function handleEmailCheck() {
    if (!EMAIL_REGEX.test(email)) { setError("올바른 이메일 형식이 아닙니다."); return; }
    setEmailCheckLoading(true);
    setError(null);
    setEmailChecked(false);
    setEmailTaken(false);

    const res = await fetch("/api/auth/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.exists) setEmailTaken(true);
    else setEmailChecked(true);
    setEmailCheckLoading(false);
  }

  function addPlayer() {
    const name = playerInput.trim();
    if (!name || favoritePlayers.includes(name)) return;
    setFavoritePlayers([...favoritePlayers, name]);
    setPlayerInput("");
  }

  function removePlayer(name: string) {
    setFavoritePlayers(favoritePlayers.filter((p) => p !== name));
  }

  // 단계 이동
  function goNext() {
    setError(null);
    if (step === 1) {
      if (!agreeTerms || !agreePrivacy) { setError("필수 약관에 동의해주세요."); return; }
    }
    if (step === 2) {
      if (!username.trim()) { setError("이름을 입력해주세요."); return; }
      if (!EMAIL_REGEX.test(email)) { setError("올바른 이메일 형식이 아닙니다."); return; }
      if (!emailChecked) { setError("이메일 중복 확인을 해주세요."); return; }
      if (!PASSWORD_RULES.every((r) => r.test(password))) { setError("비밀번호 조건을 모두 충족해주세요."); return; }
      if (password !== confirmPassword) { setError("비밀번호가 일치하지 않습니다."); return; }
    }
    setStep(step + 1);
  }

  async function handleSignUp() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username, favoriteTeam, favoritePlayers }),
    });
    const result = await res.json();
    if (result.error) { setError(result.error); setLoading(false); return; }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/mypage");
    router.refresh();
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!EMAIL_REGEX.test(email)) { setError("올바른 이메일 형식이 아닙니다."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    else { router.push("/mypage"); router.refresh(); }
    setLoading(false);
  }

  return (
    <div className="flex-1 flex flex-col justify-center gap-6 px-6 py-10 max-w-sm mx-auto w-full">
      {/* 헤더 */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-2xl">⚾</span>
        </div>
        <h1 className="text-lg font-black text-gray-900">KBO 야구</h1>
        <p className="text-xs text-gray-400 mt-1">
          {isSignUp ? `회원가입 (${step}/3)` : "로그인하고 야구 기록을 관리하세요"}
        </p>
      </div>

      <div className="flex flex-col gap-4">

      {/* 로그인 */}
      {!isSignUp && (
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type={showPassword ? "text" : "password"} placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl disabled:opacity-50 transition-opacity">
            {loading ? "처리 중..." : "로그인"}
          </button>
        </form>
      )}

      {/* 회원가입 - 슬라이딩 스텝 */}
      {isSignUp && (
        <div>
          <StepIndicator step={step} />

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
            >
              {/* Step 1: 약관 동의 */}
              <div className={`w-full shrink-0 space-y-3 ${step !== 1 ? "pointer-events-none" : ""}`}>
                <p className="text-sm font-semibold text-gray-700 mb-3">서비스 이용을 위해 약관에 동의해주세요</p>
                <label className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 cursor-pointer active:bg-gray-50">
                  <input type="checkbox" checked={agreeTerms && agreePrivacy}
                    onChange={(e) => { setAgreeTerms(e.target.checked); setAgreePrivacy(e.target.checked); }}
                    className="w-4 h-4 rounded accent-blue-600" />
                  <span className="text-sm font-bold text-gray-800">전체 동의</span>
                </label>
                <div className="space-y-2 pl-1">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">[필수] 서비스 이용약관</p>
                    <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 leading-relaxed space-y-2 max-h-32 overflow-y-auto">
                      <p><strong>제1조(목적)</strong> 본 약관은 KBO 야구 서비스(이하 "서비스")가 제공하는 경기 기록 및 직관 기록 관리 서비스의 이용조건과 절차, 이용자와 서비스의 권리·의무·책임사항을 규정함을 목적으로 합니다.</p>
                      <p><strong>제2조(약관의 효력 및 변경)</strong> 본 약관은 서비스 화면에 게시함으로써 효력이 발생하며, 관련 법령의 범위 내에서 개정될 수 있습니다. 약관 변경 시 적용일 7일 전부터 공지하며, 변경 후에도 계속 서비스를 이용하는 경우 변경된 약관에 동의한 것으로 간주합니다.</p>
                      <p><strong>제3조(회원가입 및 탈퇴)</strong> 회원가입은 이용자가 약관에 동의하고 가입 신청을 완료함으로써 성립합니다. 회원은 언제든지 탈퇴를 신청할 수 있으며, 탈퇴 시 개인정보는 지체 없이 파기됩니다.</p>
                      <p><strong>제4조(이용자의 의무)</strong> 이용자는 타인의 정보를 도용하거나 허위 정보를 기재해서는 안 됩니다. 서비스를 이용하여 법령 또는 본 약관이 금지하는 행위를 해서는 안 되며, 위반 시 서비스 이용이 제한될 수 있습니다.</p>
                      <p><strong>제5조(서비스 제공 및 중단)</strong> 서비스는 연중무휴 24시간 제공을 원칙으로 하나, 시스템 점검·장애·천재지변 등 불가피한 사유로 일시 중단될 수 있습니다.</p>
                      <p><strong>제6조(면책)</strong> 서비스는 무료로 제공되며, 서비스 이용 중 발생한 손해에 대해 고의 또는 중과실이 없는 한 책임을 지지 않습니다.</p>
                    </div>
                    <label className="flex items-center justify-end gap-2 cursor-pointer mt-1.5">
                      <span className="text-xs text-gray-500">위 이용약관 내용을 읽고 동의합니다.</span>
                      <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 rounded accent-blue-600 shrink-0" />
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
                        className="w-4 h-4 rounded accent-blue-600 shrink-0" />
                    </label>
                  </div>
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <button type="button" onClick={goNext}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl mt-2">
                  다음
                </button>
              </div>

              {/* Step 2: 회원정보 */}
              <div className={`w-full shrink-0 space-y-3 ${step !== 2 ? "pointer-events-none" : ""}`}>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="이름" value={username} onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" placeholder="이메일" value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailChecked(false); setEmailTaken(false); }}
                      className={`w-full pl-10 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 ${
                        emailChecked ? "pr-9 border-green-400 focus:border-green-400 focus:ring-green-100"
                        : emailTaken ? "pr-9 border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "pr-4 border-gray-200 focus:border-blue-400 focus:ring-blue-100"}`} />
                    {emailChecked && <Check size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500" />}
                    {emailTaken && <X size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-500" />}
                  </div>
                  <button type="button" onClick={handleEmailCheck} disabled={emailCheckLoading || emailChecked}
                    className={`shrink-0 px-3 py-3 rounded-2xl text-xs font-bold transition-colors ${
                      emailChecked ? "bg-green-100 text-green-600"
                      : emailTaken ? "bg-red-50 text-red-500"
                      : "bg-blue-50 text-blue-600 active:bg-blue-100"}`}>
                    {emailCheckLoading ? "확인 중" : emailChecked ? "확인 완료" : emailTaken ? "사용 불가" : "중복 확인"}
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? "text" : "password"} placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 px-1">
                    {PASSWORD_RULES.map((rule) => {
                      const ok = rule.test(password);
                      return (
                        <span key={rule.label} className={`flex items-center gap-1 text-xs ${ok ? "text-green-500" : "text-gray-400"}`}>
                          <Check size={11} />{rule.label}
                        </span>
                      );
                    })}
                  </div>
                )}
                <div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showConfirmPassword ? "text" : "password"} placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 ${
                        confirmPassword
                          ? password === confirmPassword ? "border-green-400 focus:border-green-400 focus:ring-green-100"
                          : "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-200 focus:border-blue-400 focus:ring-blue-100"}`} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <p className={`text-xs mt-1 px-1 ${password === confirmPassword ? "text-green-500" : "text-red-400"}`}>
                      {password === confirmPassword ? "비밀번호가 일치합니다" : "비밀번호가 일치하지 않습니다"}
                    </p>
                  )}
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setStep(1); setError(null); }}
                    className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500">
                    이전
                  </button>
                  <button type="button" onClick={goNext}
                    className="flex-[2] bg-blue-600 text-white font-bold py-3 rounded-2xl">
                    다음
                  </button>
                </div>
              </div>

              {/* Step 3: 최애 팀/선수 */}
              <div className={`w-full shrink-0 space-y-4 ${step !== 3 ? "pointer-events-none" : ""}`}>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">최애 팀 <span className="text-gray-400 font-normal">(선택)</span></p>
                  <div className="grid grid-cols-5 gap-2">
                    {KBO_TEAMS.map((team) => (
                      <button key={team} type="button" onClick={() => setFavoriteTeam(favoriteTeam === team ? null : team)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                          favoriteTeam === team ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-white"}`}>
                        <img src={TEAM_LOGOS[team]} alt={team} className="w-8 h-8 object-contain" />
                        <span className="text-[10px] font-semibold text-gray-700">{team}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">최애 선수 <span className="text-gray-400 font-normal">(선택, 여러 명 가능)</span></p>
                  <div className="flex gap-2">
                    <input type="text" placeholder="선수 이름 입력" value={playerInput}
                      onChange={(e) => setPlayerInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPlayer(); }}}
                      className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    <button type="button" onClick={addPlayer}
                      className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Plus size={18} />
                    </button>
                  </div>
                  {favoritePlayers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {favoritePlayers.map((p) => (
                        <span key={p} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          {p}
                          <button type="button" onClick={() => removePlayer(p)}><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setStep(2); setError(null); }}
                    className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500">
                    이전
                  </button>
                  <button type="button" onClick={handleSignUp} disabled={loading}
                    className="flex-[2] bg-blue-600 text-white font-bold py-3 rounded-2xl disabled:opacity-50">
                    {loading ? "처리 중..." : "가입 완료"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <button type="button" onClick={handleToggle} className="text-sm text-gray-400 text-center w-full py-3 touch-manipulation">
        {isSignUp ? "이미 계정이 있으신가요? 로그인" : "계정이 없으신가요? 회원가입"}
      </button>
    </div>
    </div>
  );
}
