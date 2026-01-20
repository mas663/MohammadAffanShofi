import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    // Check admin session from cookies
    const cookieStore = await cookies();
    const session = cookieStore.get("admin-session");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("profile")
      .select("*")
      .single();

    if (error) throw error;

    // Map database fields to expected hero fields
    const heroData = {
      greeting: data.greeting || "",
      role: data.tagline || "",
      bio: data.bio || "",
      photo: data.photo || "",
      job_titles: data.job_titles || [],
      tech_stack: data.tech_stack || [],
    };

    return NextResponse.json(heroData);
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero data" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Check admin session from cookies
    const cookieStore = await cookies();
    const session = cookieStore.get("admin-session");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { greeting, role, bio, photo, job_titles, tech_stack } = body;

    // First, get the profile ID
    const { data: profile } = await supabaseAdmin
      .from("profile")
      .select("id")
      .limit(1)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Map to actual database columns
    const updateData: Record<string, unknown> = {
      photo,
    };

    // Only update fields that exist in database
    if (greeting !== undefined) updateData.greeting = greeting;
    if (role !== undefined) updateData.tagline = role;
    if (bio !== undefined) updateData.bio = bio;
    if (job_titles !== undefined) updateData.job_titles = job_titles;
    if (tech_stack !== undefined) updateData.tech_stack = tech_stack;

    const { data, error } = await supabaseAdmin
      .from("profile")
      .update(updateData)
      .eq("id", profile.id)
      .select()
      .single();

    if (error) throw error;

    // Return data in expected format
    const responseData = {
      greeting: data.greeting || "",
      role: data.tagline || "",
      bio: data.bio || "",
      photo: data.photo || "",
      job_titles: data.job_titles || [],
      tech_stack: data.tech_stack || [],
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error updating hero data:", error);
    return NextResponse.json(
      { error: "Failed to update hero data" },
      { status: 500 },
    );
  }
}
