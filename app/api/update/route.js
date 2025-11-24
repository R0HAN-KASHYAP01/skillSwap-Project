// app/api/update/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, full_name, username, bio, profile_pic, cover_pic } = body;

    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const { data, error } = await supabase
      .from("profile_users")
      .update({ full_name, username, bio, profile_pic, cover_pic })
      .eq("id", userId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const { password: _pw, ...userWithoutPw } = data;
    return NextResponse.json({ success: true, user: userWithoutPw });
  } catch (err) {
    console.error("update profile error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
