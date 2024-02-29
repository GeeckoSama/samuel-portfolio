import { createClient } from "@supabase/supabase-js";
import type { Database } from "./schema";

export const supabase = createClient<Database>(
  import.meta.env.PUBLIC_SUPABASE_URL ?? process.env['SUPABASE_URL'],
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? process.env['SUPABASE_ANON_KEY']
);