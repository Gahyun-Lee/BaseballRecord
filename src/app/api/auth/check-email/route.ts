import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "이메일을 입력해주세요." }, { status: 400 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?filter=${encodeURIComponent(email)}`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }

  const data = await res.json();
  const exists = data.users?.some((u: { email: string }) => u.email === email) ?? false;

  return NextResponse.json({ exists });
}
