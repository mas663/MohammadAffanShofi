import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log environment variables status (without exposing values)
if (typeof window === "undefined") {
  // Server-side only logging
  console.log("[Supabase] Environment check:", {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    hasServiceKey: !!supabaseServiceKey,
    urlPrefix: supabaseUrl?.substring(0, 20),
  });
}

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = `Missing Supabase environment variables: URL=${!!supabaseUrl}, Key=${!!supabaseAnonKey}`;
  if (typeof window !== "undefined") {
    console.error("[Supabase]", errorMsg);
  }
  throw new Error(errorMsg);
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
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

// For server-side admin operations
if (!supabaseServiceKey) {
  console.warn(
    "[Supabase] Service role key not found - admin operations will fail",
  );
}

export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey, // Fallback to anon key for build
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
