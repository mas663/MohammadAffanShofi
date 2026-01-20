import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate at build time but don't throw - use placeholder for build
const buildTimeUrl = supabaseUrl || "https://placeholder.supabase.co";
const buildTimeKey = supabaseAnonKey || "placeholder-key";

// Log environment status (server-side only)
if (typeof window === "undefined") {
  console.log("[Supabase] Config status:", {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    hasServiceKey: !!supabaseServiceKey,
    urlPrefix: supabaseUrl?.substring(0, 30),
  });
}

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

// Server-side admin client
const buildTimeServiceKey = supabaseServiceKey || buildTimeKey;

export const supabaseAdmin: SupabaseClient = createClient(
  buildTimeUrl,
  buildTimeServiceKey,
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
