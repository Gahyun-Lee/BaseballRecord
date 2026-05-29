import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  email, setEmail, password, setPassword, loading, error, onSubmit,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="relative">
        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" />
      </div>
      <div className="relative">
        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type={showPassword ? "text" : "password"} placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100" />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full bg-navy-600 text-white font-bold py-3 rounded-2xl disabled:opacity-50 transition-opacity">
        {loading ? "처리 중..." : "로그인"}
      </button>
    </form>
  );
}
