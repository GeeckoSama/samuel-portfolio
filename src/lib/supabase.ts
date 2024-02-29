import { createClient } from "@supabase/supabase-js";
import type { Database } from "./schema";
import { RequestEvent, RequestEventAction, RequestEventLoader } from "@builder.io/qwik-city";
import { createServerClient } from "supabase-auth-helpers-qwik";

export const supabase = createClient<Database>(
  import.meta.env.PUBLIC_SUPABASE_URL ?? process.env['SUPABASE_URL'],
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? process.env['SUPABASE_ANON_KEY']
);

export const supabaseServer = (requestEvent: RequestEvent | RequestEventAction | RequestEventLoader) => {
  const supabase_url = requestEvent.env.get("PUBLIC_SUPABASE_URL") ?? process.env['SUPABASE_URL'];
  const supabase_anon_key = requestEvent.env.get("PUBLIC_SUPABASE_ANON_KEY") ?? process.env['SUPABASE_ANON_KEY'];
  if (!supabase_url || !supabase_anon_key) {
    throw new Error("Missing supabase url or anon key");
  }
  return createServerClient<Database>(supabase_url, supabase_anon_key, requestEvent);
};