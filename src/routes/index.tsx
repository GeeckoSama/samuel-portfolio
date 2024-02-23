import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { createServerClient } from "supabase-auth-helpers-qwik";
import type { Database } from "~/lib/schema";

export interface Photo {
  id: number;
  title: string;
  description: string;
  url: string;
  create_at: Date;
  updated_at: Date;
}

export const usePhotos = routeLoader$(async (requestEvent) => {
  const supabaseClient = createServerClient<Database>(
    requestEvent.env.get("PUBLIC_SUPABASE_URL")!,
    requestEvent.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
    requestEvent,
  );
  return await supabaseClient.from("photos").select("*");
});

export default component$(() => {
  const signal = usePhotos();
  return (
    <>
      <h1>Hello world</h1>
      {signal.value.data?.map((photo) => (
        <img
          key={photo.id}
          src={photo.url ?? ""}
          alt={photo.description ?? ""}
          width={500}
          height={500}
        />
      ))}
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
