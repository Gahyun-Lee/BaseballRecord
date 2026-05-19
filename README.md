# ⚾ BaseballRecord

KBO 야구 직관 기록 웹앱

경기 일정 확인, 팀·선수 기록 조회, 내 직관 기록 관리까지 한 곳에서.

---

## 기술 스택

| | |
|---|---|
| Framework | Next.js (App Router) |
| Auth / DB | Supabase |
| Styling | Tailwind CSS v4 |
| Deploy | Vercel |

---

## 로컬 실행

**1. 패키지 설치**
```bash
npm install
```

**2. 환경변수 설정**

`.env.local` 파일 생성 후 아래 값 입력:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
> Supabase 대시보드 → Settings → API 에서 확인

**3. 개발 서버 실행**
```bash
npm run dev
# http://localhost:3000
```

---

## 페이지 구조

```
/              홈
/games         경기 일정
/records       팀 · 선수 기록
/stadiums      구장 정보
/mypage        내 직관 기록  (로그인 필요)
```
