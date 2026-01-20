import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Simple hardcoded admin check
    if (username === "admin" && password === "admin123") {
      // Create a simple session token
      const session = {
        user: {
          id: "admin",
          username: "admin",
        },
        access_token: "admin-session-token",
        expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };

      console.log("[Login] Setting admin session cookie");

      const response = NextResponse.json({ user: session.user, session });

      // Set session cookie with proper settings for production
      response.cookies.set("admin-session", JSON.stringify(session), {
        httpOnly: true,
        secure: true, // Always use secure in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 24 * 60 * 60, // 24 hours
        path: "/",
      });

      console.log("[Login] Cookie set successfully");

      return response;
    } else {
      throw new Error("Invalid username or password");
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
