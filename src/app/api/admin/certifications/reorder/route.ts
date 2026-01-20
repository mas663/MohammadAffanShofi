import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(request: Request) {
  try {
    const { certifications } = await request.json();

    // Update each certification with new order_index
    const updates = certifications.map(
      (cert: { id: string }, index: number) => ({
        id: cert.id,
        order_index: index,
      }),
    );

    for (const update of updates) {
      await supabaseAdmin
        .from("certifications")
        .update({ order_index: update.order_index })
        .eq("id", update.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering certifications:", error);
    return NextResponse.json(
      { error: "Failed to reorder certifications" },
      { status: 500 },
    );
  }
}
