"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { KboTeam } from "@/types";
import { EMAIL_REGEX, PASSWORD_RULES } from "@/utils/validation";
import LoginForm from "./LoginForm";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import SignupStep3 from "./SignupStep3";

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
            s < step ? "bg-navy-600 text-white" :
            s === step ? "bg-navy-600 text-white ring-4 ring-navy-100" :
            "bg-gray-100 text-gray-400"
          }`}>
            {s < step ? <Check size={14} /> : s}
          </div>
          {s < 3 && (
            <div className={`w-12 h-0.5 transition-colors duration-300 ${s < step ? "bg-navy-600" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const [favoriteTeam, setFavoriteTeam] = useState<KboTeam | null>(null);
  const [favoritePlayers, setFavoritePlayers] = useState<{ id: number; name: string; team: string }[]>([]);

  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  function handleToggle() {
    setIsSignUp(!isSignUp);
    setStep(1);
    setError(null);
    setUsername(""); setEmail(""); setPassword(""); setConfirmPassword("");
    setEmailChecked(false); setEmailTaken(false);
    setEmailError(null); setShowEmailTooltip(false);
    setAgreeTerms(false); setAgreePrivacy(false);
    setFavoriteTeam(null); setFavoritePlayers([]);
  }

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
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  }

  function goPrev() {
    setError(null);
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSignUp() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username, favoriteTeam, favoritePlayers: favoritePlayers.map((p) => p.id) }),
      });
      const result = await res.json();
      if (result.error) { setError(result.error); return; }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("가입은 완료되었으나 로그인에 실패했습니다. 로그인 페이지에서 다시 시도해주세요.");
        return;
      }
      router.push("/mypage");
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!EMAIL_REGEX.test(email)) { setError("올바른 이메일 형식이 아닙니다."); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      else { router.push("/mypage"); router.refresh(); }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center gap-6 px-6 py-10 max-w-sm mx-auto w-full">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-navy-600 flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-2xl">⚾</span>
        </div>
        <h1 className="text-lg font-black text-gray-900">KBO 야구</h1>
        <p className="text-xs text-gray-400 mt-1">
          {isSignUp ? `회원가입 (${step}/3)` : "로그인하고 야구 기록을 관리하세요"}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {!isSignUp && (
          <LoginForm
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            loading={loading} error={error} onSubmit={handleLogin}
          />
        )}

        {isSignUp && (
          <div>
            <StepIndicator step={step} />
            <div className={step !== 1 ? "hidden" : ""}>
              <SignupStep1
                agreeTerms={agreeTerms} setAgreeTerms={setAgreeTerms}
                agreePrivacy={agreePrivacy} setAgreePrivacy={setAgreePrivacy}
                error={step === 1 ? error : null} onNext={goNext}
              />
            </div>
            <div className={step !== 2 ? "hidden" : ""}>
              <SignupStep2
                username={username} setUsername={setUsername}
                email={email} setEmail={setEmail}
                password={password} setPassword={setPassword}
                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                emailChecked={emailChecked} setEmailChecked={setEmailChecked}
                emailTaken={emailTaken} setEmailTaken={setEmailTaken}
                emailError={emailError} setEmailError={setEmailError}
                showEmailTooltip={showEmailTooltip} setShowEmailTooltip={setShowEmailTooltip}
                error={step === 2 ? error : null} onNext={goNext} onPrev={goPrev}
              />
            </div>
            <div className={step !== 3 ? "hidden" : ""}>
              <SignupStep3
                favoriteTeam={favoriteTeam} setFavoriteTeam={setFavoriteTeam}
                favoritePlayers={favoritePlayers} setFavoritePlayers={setFavoritePlayers}
                error={step === 3 ? error : null} loading={loading}
                onSubmit={handleSignUp} onPrev={goPrev}
              />
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
