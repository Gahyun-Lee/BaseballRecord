---
name: KBO Baseball Record
version: 1.0.0

colors:
  primary:
    blue-600: "#2563EB"
    blue-500: "#3B82F6"
  neutral:
    white: "#FFFFFF"
    gray-50: "#F9FAFB"
    gray-100: "#F3F4F6"
    gray-200: "#E5E7EB"
    gray-400: "#9CA3AF"
    gray-500: "#6B7280"
    gray-600: "#4B5563"
    gray-900: "#111827"
  accent:
    green-500: "#22C55E"
    orange-500: "#F97316"
    purple-500: "#A855F7"
    red-600: "#DC2626"
  background: "#F9FAFB"
  foreground: "#0F172A"
  themeColor: "#1D4ED8"

typography:
  fontFamily:
    primary: "Pretendard, Apple SD Gothic Neo, Noto Sans KR, sans-serif"
    mono: "Geist Mono, monospace"
  heading:
    page:
      fontSize: "24px"
      fontWeight: 700
      lineHeight: 1.3
    section:
      fontSize: "18px"
      fontWeight: 700
      lineHeight: 1.4
    card:
      fontSize: "14px"
      fontWeight: 700
      lineHeight: 1.4
  body:
    default:
      fontSize: "14px"
      fontWeight: 400
      lineHeight: 1.5
    small:
      fontSize: "12px"
      fontWeight: 400
      lineHeight: 1.5
    caption:
      fontSize: "12px"
      fontWeight: 400
      lineHeight: 1.4

layout:
  maxWidth: "512px"
  containerClass: "max-w-lg mx-auto"
  padding: "16px"
  gap:
    cards: "12px"
    sections: "16px"
  grid:
    home: "grid-cols-2"

spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"

shapes:
  borderRadius:
    card: "16px"
    icon: "12px"
    button: "12px"
    chip: "9999px"

elevation:
  card: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
  container: "0 1px 2px 0 rgb(0 0 0 / 0.05)"

components:
  header:
    height: "56px"
    background: "{colors.neutral.white}"
    borderBottom: "1px solid {colors.neutral.gray-200}"
    position: "sticky top-0"
    zIndex: 40
  navbar:
    position: "fixed bottom-0"
    background: "{colors.neutral.white}"
    borderTop: "1px solid {colors.neutral.gray-200}"
    zIndex: 50
    iconSize: "22px"
    labelSize: "12px"
    activeColor: "{colors.primary.blue-600}"
    inactiveColor: "{colors.neutral.gray-400}"
  card:
    background: "{colors.neutral.white}"
    border: "1px solid {colors.neutral.gray-100}"
    borderRadius: "{shapes.borderRadius.card}"
    padding: "16px"
    shadow: "{elevation.card}"
    activeScale: 0.95
  iconBadge:
    size: "40px"
    borderRadius: "{shapes.borderRadius.icon}"
    iconSize: "20px"
    iconColor: "{colors.neutral.white}"
---

## Overview

KBO 야구 기록 모바일 웹앱의 디자인 시스템. 모바일 퍼스트로 설계되어 `max-w-lg` (512px)로 컨테이너를 제한하고, 흰색 배경 위에 카드 기반 UI를 사용한다. 한국어 UI에 최적화된 Pretendard 폰트를 기본으로 한다.

## Colors

- **Primary blue** (`#2563EB`)는 활성 네비게이션, 주요 CTA에 사용
- **Neutral grays**는 텍스트 계층을 구성: `gray-900`(제목) → `gray-500`(보조 텍스트) → `gray-400`(비활성/캡션)
- **Accent colors**는 홈 카드 아이콘 배지에 사용: 경기(blue), 기록(green), 구장(orange), 내 정보(purple)
- KBO 10개 팀은 별도 팀 컬러를 사용 (`src/utils/constants.ts`의 `TEAM_COLORS` 참조)
- 배경은 `gray-50`, 카드/컨테이너는 `white`로 레이어 분리

## Typography

- **Pretendard**를 기본 폰트로 사용. 한글과 영문 모두 깔끔하게 렌더링
- 제목은 `font-bold`(700), 본문은 regular(400)로 구분
- 페이지 제목은 `text-2xl`(24px), 헤더 제목은 `text-lg`(18px)
- 카드 내 설명은 `text-xs`(12px)로 간결하게

## Layout

- 전체 앱이 `max-w-lg mx-auto`로 512px 이내에 표시되는 모바일 퍼스트 레이아웃
- 상단 `Header`(sticky, 56px)와 하단 `Navbar`(fixed)로 구성된 앱 쉘
- 메인 콘텐츠는 `pb-20`으로 하단 네비바와 겹치지 않도록 패딩
- 홈은 2열 그리드(`grid-cols-2 gap-3`), 리스트 페이지는 단일 컬럼

## Elevation & Depth

- 카드에 `shadow-sm` 적용 — 미세한 그림자로 떠 있는 느낌
- 전체 컨테이너에도 `shadow-sm`으로 좌우 경계를 암시
- z-index: Header(`40`) < Navbar(`50`)

## Shapes

- 카드: `rounded-2xl`(16px) — 부드럽고 현대적인 느낌
- 아이콘 배지: `rounded-xl`(12px)
- 전반적으로 둥근 모서리를 적극 활용하여 친근한 느낌

## Components

- **Header**: 서브페이지에서 뒤로가기 chevron + 페이지 제목. 루트(`/`)에서는 숨김
- **Navbar**: 4탭 하단 네비게이션(경기/기록/구장/내정보). 활성 탭은 blue-600 + bold
- **HomeCard**: 2열 그리드의 카드. 컬러 아이콘 배지 + 제목 + 설명. `active:scale-95` 터치 피드백
- **IconBadge**: 40x40 컬러 배경에 22px 흰색 Lucide 아이콘

## Do's and Don'ts

- Do: 모든 터치 타겟은 최소 44px 이상 유지
- Do: 팀 관련 UI에는 `TEAM_COLORS`의 primary 색상 사용
- Do: 한국어 텍스트에 Pretendard 폰트 사용
- Do: 카드에 `active:scale-95` 터치 피드백 적용
- Don't: 512px 이상의 레이아웃을 만들지 않음
- Don't: 팀 컬러를 하드코딩하지 않음 — 항상 `TEAM_COLORS` 상수 참조
- Don't: 네비바 위에 플로팅 요소를 두지 않음 (z-50 이상 사용 금지)
