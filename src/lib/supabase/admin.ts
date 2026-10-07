import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * CAUTION: Service Role Client has FULL administrative privileges and bypasses Row Level Security (RLS).
 * MUST ONLY be imported and called inside secure server-side handlers (API routes / server actions).
 * NEVER expose or send to the browser client.
 */
export function createAdminClient() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing from environment variables!");
  }
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
