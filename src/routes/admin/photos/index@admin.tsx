import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Table } from "@components/table/table";
import { supabaseServer } from "@libs/supabase";
import type { Photos } from "~/types/photo";

export const usePhotos = routeLoader$(async (requestEvent) => {
  const supabaseClient = supabaseServer(requestEvent);
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
