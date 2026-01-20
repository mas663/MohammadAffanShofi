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
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check admin session from cookies
    const cookieStore = await cookies();
    const session = cookieStore.get("admin-session");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Get highest order_index
    const { data: existingProjects } = await supabaseAdmin
      .from("projects")
      .select("order_index")
      .order("order_index", { ascending: false })
      .limit(1);

    const nextOrderIndex = existingProjects?.length
      ? (existingProjects[0].order_index ?? 0) + 1
      : 0;

    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert({
        ...body,
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
