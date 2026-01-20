import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(request: Request) {
  try {
    const { skills } = await request.json();

    // Update each skill with new order_index
    const updates = skills.map((skill: { id: string }, index: number) => ({
      id: skill.id,
      order_index: index,
    }));

    for (const update of updates) {
      await supabaseAdmin
        .from("skills")
        .update({ order_index: update.order_index })
        .eq("id", update.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering skills:", error);
    return NextResponse.json(
      { error: "Failed to reorder skills" },
      { status: 500 },
    );
  }
}
