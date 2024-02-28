import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { createServerClient } from "supabase-auth-helpers-qwik";
import { Table } from "~/components/table/table";
import type { Database } from "~/lib/schema";
import type { Photos } from "~/types/photo";

export const usePhotos = routeLoader$(async (requestEvent) => {
  const supabaseClient = createServerClient<Database>(
    requestEvent.env.get("PUBLIC_SUPABASE_URL")!,
    requestEvent.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
    requestEvent,
  );
  return await supabaseClient.from("photos").select("*");
});

export default component$(() => {
  const photos = usePhotos();
  return (
    <div class="card mx-auto max-w-7xl bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title">Toutes les photos</h2>
        <Table data={photos.value.data as Photos} />
      </div>
    </div>
  );
});
