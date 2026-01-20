import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(request: Request) {
  try {
    const { projects } = await request.json();

    // Update each project with new order_index
    const updates = projects.map((project: { id: string }, index: number) => ({
      id: project.id,
      order_index: index,
    }));

    for (const update of updates) {
      await supabaseAdmin
        .from("projects")
        .update({ order_index: update.order_index })
        .eq("id", update.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering projects:", error);
    return NextResponse.json(
      { error: "Failed to reorder projects" },
      { status: 500 },
    );
  }
}
