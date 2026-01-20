import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });

    // Clear session cookie
    response.cookies.delete("admin-session");

    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Logout failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
