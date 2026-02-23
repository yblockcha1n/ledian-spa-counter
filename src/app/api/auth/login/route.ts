import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "ユーザー名とパスワードを入力してください" }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, password_hash")
      .eq("username", username)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "ユーザー名またはパスワードが正しくありません" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "ユーザー名またはパスワードが正しくありません" }, { status: 401 });
    }

    const token = signToken({ userId: user.id, username: user.username });

    const response = NextResponse.json({
      user: { id: user.id, username: user.username },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7日
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
