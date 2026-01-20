import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("profile")
      .select("*")
      .single();

    if (error) throw error;

    // Map database fields for hero compatibility
    const profileData = {
      ...data,
      role: data.tagline, // Map tagline to role for hero
      greeting: data.greeting || "",
      bio: data.bio || data.about,
      job_titles: data.job_titles || [],
      tech_stack: data.tech_stack || [],
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
