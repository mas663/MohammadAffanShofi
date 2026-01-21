import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validation
    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 },
      );
    }

    if (name.length > 255) {
      return NextResponse.json({ error: "Name is too long" }, { status: 400 });
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message is too long (max 1000 characters)" },
        { status: 400 },
      );
    }

    // Optional email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        name: name.trim(),
        email: email?.trim() || null,
        message: message.trim(),
        is_approved: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
