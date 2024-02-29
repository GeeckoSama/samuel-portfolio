import { createClient } from "@supabase/supabase-js";
import type { Database } from "./schema";
import { RequestEvent, RequestEventAction, RequestEventLoader } from "@builder.io/qwik-city";
import { createServerClient } from "supabase-auth-helpers-qwik";

export const supabaseClient = () => {
  const supabase_url = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabase_anon_key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!supabase_url || !supabase_anon_key) {
    throw new Error("Missing supabase url or anon key on client");
  }
  return createClient<Database>(supabase_url, supabase_anon_key);
};

export const supabaseServer = (requestEvent: RequestEvent | RequestEventAction | RequestEventLoader) => {
  const supabase_url = process.env['PUBLIC_SUPABASE_URL'] ?? requestEvent.env.get("PUBLIC_SUPABASE_URL");
  const supabase_anon_key = process.env['PUBLIC_SUPABASE_ANON_KEY'] ?? requestEvent.env.get("PUBLIC_SUPABASE_ANON_KEY");
  if (!supabase_url || !supabase_anon_key) {
    throw new Error("Missing supabase url or anon key on server");
  }
  return createServerClient<Database>(supabase_url, supabase_anon_key, requestEvent);
};