// app/api/upload/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const bucket = form.get("bucket");
    const userId = form.get("userId");

    if (!file || !bucket || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // make filename with extension
    const ext = (file.name && file.name.split(".").pop()) || "jpg";
    const fileName = `${userId}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return NextResponse.json({ success: true, url: data.publicUrl });
  } catch (err) {
    console.error("upload error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
