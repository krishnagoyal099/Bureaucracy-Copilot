// src/lib/storage/supabase.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/config/env";

/**
 * Supabase client initialized with the service role key.
 * Use ONLY on the server. Never expose this to the client.
 */
export const supabaseAdmin: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Generates a short-lived signed URL for a private file.
 */
export async function getSignedFileUrl(filePath: string, expiresIn: number = 60): Promise<string> {
  const { data, error } = await supabaseAdmin
    .storage
    .from(env.SUPABASE_BUCKET)
    .createSignedUrl(filePath, expiresIn);

  if (error || !data) {
    throw new Error(`Failed to generate signed URL: ${error?.message ?? "Unknown error"}`);
  }
  return data.signedUrl;
}
