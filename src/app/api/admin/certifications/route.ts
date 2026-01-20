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
      .from("certifications")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch certifications" },
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
    const { data: existingCerts } = await supabaseAdmin
      .from("certifications")
      .select("order_index")
      .order("order_index", { ascending: false })
      .limit(1);

    const nextOrderIndex = existingCerts?.length
      ? (existingCerts[0].order_index ?? 0) + 1
      : 0;

    const { data, error } = await supabaseAdmin
      .from("certifications")
      .insert({
        ...body,
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating certification:", error);
    return NextResponse.json(
      { error: "Failed to create certification" },
      { status: 500 },
    );
  }
}
