import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { HeroImgGrowWithScroll } from "~/components/HeroImgGrowWithScroll/HeroImgGrowWithScroll";
import { Hero } from "~/components/hero/hero";
import { supabaseServer } from "~/lib/supabase";

export interface Photo {
  id: number;
  title: string;
  description: string;
  url: string;
  create_at: Date;
  updated_at: Date;
}

export const usePhotos = routeLoader$(async (requestEvent) => {
  const supabaseClient = supabaseServer(requestEvent);
  return await supabaseClient.from("photos").select("*");
});

export default component$(() => {
  //const signal = usePhotos();
  return (
    <>
      <HeroImgGrowWithScroll imgUrl="https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg" imgAlt="a picture" imgHeight={1080} imgWidth={1920} text="samuel freret" />
      <Hero />
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
