import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    // Check admin session from cookies
    const cookieStore = await cookies();
    const session = cookieStore.get("admin-session");

    console.log("[About GET] Cookie present:", !!session);

    if (!session) {
      console.log("[About GET] Unauthorized - no session cookie");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("profile")
      .select("*")
      .limit(1)
      .single();

    if (error) throw error;

    // Map database fields to expected about fields
    const aboutData = {
      heading: data.about_heading || "About Me",
      subtitle:
        data.about_subtitle || "Transforming ideas into digital experiences",
      name: data.name || "",
      description: data.about || "",
      quote: data.about_quote || "",
      photo: data.about_photo || data.photo || "",
      cvUrl: data.cv_url || "",
      yearsOfExperience: data.years_of_experience || 0,
    };

    return NextResponse.json(aboutData);
  } catch (error) {
    console.error("Error fetching about data:", error);
    return NextResponse.json(
      { error: "Failed to fetch about data" },
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
    const {
      heading,
      subtitle,
      name,
      description,
      quote,
      photo,
      cvUrl,
      yearsOfExperience,
    } = body;

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
    const updateData: Record<string, unknown> = {};

    if (heading !== undefined) updateData.about_heading = heading;
    if (subtitle !== undefined) updateData.about_subtitle = subtitle;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.about = description;
    if (quote !== undefined) updateData.about_quote = quote;
    if (photo !== undefined) updateData.about_photo = photo;
    if (cvUrl !== undefined) updateData.cv_url = cvUrl;
    if (yearsOfExperience !== undefined)
      updateData.years_of_experience = yearsOfExperience;

    const { data, error } = await supabaseAdmin
      .from("profile")
      .update(updateData)
      .eq("id", profile.id)
      .select()
      .single();

    if (error) throw error;

    // Return data in expected format
    const responseData = {
      heading: data.about_heading || "About Me",
      subtitle: data.about_subtitle || "",
      name: data.name || "",
      description: data.about || "",
      quote: data.about_quote || "",
      photo: data.about_photo || data.photo || "",
      cvUrl: data.cv_url || "",
      yearsOfExperience: data.years_of_experience || 0,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error updating about data:", error);
    return NextResponse.json(
      { error: "Failed to update about data" },
      { status: 500 },
    );
  }
}
