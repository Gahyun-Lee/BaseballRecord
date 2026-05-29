import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Check, X } from "lucide-react";
import { EMAIL_REGEX, PASSWORD_RULES } from "@/utils/validation";

interface SignupStep2Props {
  username: string;
  setUsername: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  emailChecked: boolean;
  setEmailChecked: (v: boolean) => void;
  emailTaken: boolean;
  setEmailTaken: (v: boolean) => void;
  emailError: string | null;
  setEmailError: (v: string | null) => void;
  showEmailTooltip: boolean;
  setShowEmailTooltip: (v: boolean) => void;
  error: string | null;
  onNext: () => void;
  onPrev: () => void;
}

export default function SignupStep2({
  username, setUsername, email, setEmail,
  password, setPassword, confirmPassword, setConfirmPassword,
  emailChecked, setEmailChecked, emailTaken, setEmailTaken,
  emailError, setEmailError, showEmailTooltip, setShowEmailTooltip,
  error, onNext, onPrev,
}: SignupStep2Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);

  async function handleEmailCheck() {
    setEmailError(null);
    if (!EMAIL_REGEX.test(email)) { setEmailError("올바른 이메일 형식이 아닙니다."); return; }
    setEmailCheckLoading(true);
    setEmailChecked(false);
    setEmailTaken(false);

    try {
      const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.exists) setEmailTaken(true);
      else setEmailChecked(true);
    } catch {
      setEmailError("네트워크 오류가 발생했습니다.");
    } finally {
      setEmailCheckLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="이름" value={username} onChange={(e) => setUsername(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" />
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="email" placeholder="이메일" value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailChecked(false); setEmailTaken(false); setEmailError(null); setShowEmailTooltip(false); }}
            className={`w-full pl-10 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 ${
              emailChecked ? "pr-9 border-green-400 focus:border-green-400 focus:ring-green-100"
              : (emailTaken || emailError) ? "pr-9 border-red-400 focus:border-red-400 focus:ring-red-100"
              : "pr-4 border-gray-200 focus:border-navy-400 focus:ring-navy-100"}`} />
          {emailChecked && <i className="bi bi-check-circle absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500" />}
          {(emailTaken || emailError) && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 group">
              <button type="button" onClick={() => setShowEmailTooltip(!showEmailTooltip)}>
                <i className="bi bi-x-circle text-red-500" />
              </button>
              <div className={`absolute bottom-full right-0 mb-2 ${showEmailTooltip ? "block" : "hidden group-hover:block"}`}>
                <div className="bg-gray-900 text-white text-[11px] px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg flex items-center gap-2">
                  {emailError || "이미 사용 중인 이메일입니다"}
                  <button type="button" onClick={() => setShowEmailTooltip(false)} className="text-gray-400 hover:text-white">
                    <X size={10} />
                  </button>
                  <div className="absolute top-full right-3 border-4 border-transparent border-t-gray-900" />
                </div>
              </div>
            </div>
          )}
        </div>
        <button type="button" onClick={handleEmailCheck} disabled={emailCheckLoading || emailChecked}
          className={`shrink-0 px-3 py-3 rounded-2xl text-xs font-bold transition-colors ${
            emailChecked ? "bg-green-100 text-green-600"
            : (emailTaken || emailError) ? "bg-red-50 text-red-500"
            : "bg-navy-50 text-navy-600 active:bg-navy-100"}`}>
          {emailCheckLoading ? "확인 중" : emailChecked ? "확인 완료" : emailTaken ? "사용 불가" : emailError ? "형식 오류" : "중복 확인"}
        </button>
      </div>
      <div className="relative">
        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type={showPassword ? "text" : "password"} placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" />
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
                : "border-gray-200 focus:border-navy-400 focus:ring-navy-100"}`} />
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
        <button type="button" onClick={onPrev}
          className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500">
          이전
        </button>
        <button type="button" onClick={onNext}
          className="flex-[2] bg-navy-600 text-white font-bold py-3 rounded-2xl">
          다음
        </button>
      </div>
    </div>
  );
}
