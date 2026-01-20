import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
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
