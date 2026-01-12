import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create a type that maps woolwitch_api schema to public for Supabase client compatibility
type SupabaseDatabase = Omit<Database, 'public'> & {
  public: Database['woolwitch_api']
}

// Create the Supabase client with proper type mapping
// The client will use the woolwitch_api schema (API layer) but TypeScript will see it as public schema
export const supabase = createClient<SupabaseDatabase>(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'woolwitch_api' as any }
});
