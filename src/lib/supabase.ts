import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log environment status (server-side only)
if (typeof window === "undefined") {
  console.log("[Supabase] Config status:", {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    hasServiceKey: !!supabaseServiceKey,
    urlPrefix: supabaseUrl?.substring(0, 30),
  });

  // Validate required env vars at runtime for server-side
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  if (!supabaseServiceKey) {
    throw new Error(
      "[Supabase] Missing SUPABASE_SERVICE_ROLE_KEY - required for admin operations",
    );
  }
}

// For client-side, use placeholders during build
const buildTimeUrl = supabaseUrl || "https://placeholder.supabase.co";
const buildTimeKey = supabaseAnonKey || "placeholder-key";

export const supabase: SupabaseClient = createClient(
  buildTimeUrl,
  buildTimeKey,
  {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        "x-client-info": "portfolio-client",
      },
    },
    db: {
      schema: "public",
    },
  },
);

// Server-side admin client - MUST have service role key
export const supabaseAdmin: SupabaseClient = createClient(
  buildTimeUrl,
  supabaseServiceKey || buildTimeKey, // Will throw error above if missing
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        "x-client-info": "portfolio-admin",
      },
    },
    db: {
      schema: "public",
    },
  },
);
