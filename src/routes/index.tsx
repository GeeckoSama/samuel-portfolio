import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { HeroList } from "~/components/hero-list/hero-list";
import { HeroMaskOnscroll } from "~/components/hero-mask-onscroll/hero-mask-onscroll";
import { HeroParallaxScroll } from "~/components/hero-parallax-scroll/hero-parallaxs-croll";
import { ImageSlideGallery } from "~/components/image-slide-gallery/image-slide-gallery";
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
      <HeroList
        projects={[
          {
            title: "photographie",
            src: "https://bfteqciwfomtgqrutgve.supabase.co/storage/v1/object/public/medias/photos/428939279_829369298952379_679006763649312376_n.jpg",
          },
          {
            title: "vidéographie",
            src: "https://bfteqciwfomtgqrutgve.supabase.co/storage/v1/object/public/medias/photos/430150245_1139430377511060_7339112946625226185_n.jpg",
          },
          {
            title: "biographie",
            src: "https://bfteqciwfomtgqrutgve.supabase.co/storage/v1/object/public/medias/photos/430326676_1177290423647337_6090201498634445794_n.jpg",
          },
        ]}
        sectionTitle="Samuel freret"
      />
      <HeroMaskOnscroll />
      <HeroParallaxScroll
        title="Production photographique"
        word="Paysage"
        images={[
          "https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg",
          "https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg",
          "https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg",
        ]}
      />
      <ImageSlideGallery
        projects={[
          {
            title1: "10000",
            title2: "P",
            src: "https://bfteqciwfomtgqrutgve.supabase.co/storage/v1/object/public/medias/photos/10000P_preview.png",
          },
          {
            title1: "BON",
            title2: "EXPORT",
            src: "https://bfteqciwfomtgqrutgve.supabase.co/storage/v1/object/public/medias/photos/bonexport_preview.png",
          },
          {
            title1: "Colgate &",
            title2: "Hold up",
            src: "https://bfteqciwfomtgqrutgve.supabase.co/storage/v1/object/public/medias/photos/colgate&holdup_preview.png",
          },
          {
            title1: "Interlude",
            title2: "Prie",
            src: "https://bfteqciwfomtgqrutgve.supabase.co/storage/v1/object/public/medias/photos/interlude_prie_preview.png",
          },
        ]}
        sectionTitle="Clips vidéos"
      />
    </>
  );
});

export const head: DocumentHead = {
  title: "Samuel Freret - Photographe et vidéaste",
  meta: [
    {
      name: "description",
      content:
        "Samuel Freret - Photographe et vidéaste, découvrez mes réalisations photographiques et vidéographiques",
    },
  ],
};
