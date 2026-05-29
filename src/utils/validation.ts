export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_RULES = [
  { label: "8자 이상", test: (p: string) => p.length >= 8 },
  { label: "대문자 포함", test: (p: string) => /[A-Z]/.test(p) },
  { label: "숫자 포함", test: (p: string) => /[0-9]/.test(p) },
  { label: "특수문자 포함", test: (p: string) => /[!@#$%^&*]/.test(p) },
];
