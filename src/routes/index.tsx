import { Resource, component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { ContactSection } from "@components/contact-section/contact-section";
import { HeroList } from "@components/hero-list/hero-list";
import { ImageSlideGallery } from "@components/image-slide-gallery/image-slide-gallery";
import type { Album, Photos } from "@libs/photo.type";
import type { Videos } from "@libs/video.type";
import { collection, getDocs } from "firebase/firestore";
import { SectionAlbumPhoto } from "~/components/section-album-photo/section-album-photo";
import { firestore } from "~/libs/firebase";

export const useAlbums = routeLoader$(() => {
  return async () => {
    const collectionRef = collection(firestore, "albums");
    const albums = await getDocs(collectionRef).then((snapshot) => {
      return snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Album;
      });
    });
    return albums;
  };
});

export const useFakePhotos = routeLoader$(() => {
  const photos: Photos = [
    {
      id: "1",
      title: "test",
      description: "test",
      path: "https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg",
      create_at: 0,
      update_at: 0,
    },
  ];
  return photos;
});

export const useFakeVideos = routeLoader$(() => {
  const videos: Videos = [
    {
      id: "1",
      title: "COLGATE & HOLD UP",
      description: `Quatrième clip réalisé, une fois de plus avec Camille Pruvost, où
      nous fonctionnons depuis en co-direction. Ce projet est le fruit d'une
      rencontre avec Wana$, rappeur bordelais, qui voulait retranscrire son univers
      musical avec une approche sensible et esthétique.
      Le clip, comme le morceau en lui même, est composé de deux parties
      distinctes, tout de même liées par les paroles, offrant deux ambiances
      totalement différentes ; une idylle et onirique, puis un réveil brutal dans une
      réalité plus sombre. Colgate, le soleil et la plage, Hold-Up, polar noir et nuit
      sombre. La demande de l'artiste était de dépeindre deux séquences évoquées
      dans son morceau, et les liaient par le visuel dans ce clip.
      `,
      credits: ["Réalisation : Samuel Freret & Camille Pruvost"],
      localisations: ["Bordeaux"],
      production_date: new Date().getTime(),
      cover: "",
      path: "https://bfteqciwfomtgqrutgve.supabase.co/storage/v1/object/public/medias/photos/colgate&holdup_preview.png",
      svg_path:
        "https://bfteqciwfomtgqrutgve.supabase.co/storage/v1/object/public/medias/photos/10000P_preview.png",
      youtube_url: "https://www.youtube.com/watch?v=Z4j5rJQMd4c",
      create_at: new Date().getTime(),
      update_at: new Date().getTime(),
    },
  ];
  return videos;
});

export default component$(() => {
  //const signal = useFakePhotos();
  const albums = useAlbums();
  const videos = useFakeVideos();
  return (
    <>
      <HeroList
        projects={[
          {
            title: "photographie",
            src: "https://bfteqciwfomtgqrutgve.supabase.co/storage/v1/object/public/medias/photos/428939279_829369298952379_679006763649312376_n.webp",
          },
          {
            title: "vidéographie",
            src: "https://bfteqciwfomtgqrutgve.supabase.co/storage/v1/object/public/medias/photos/430150245_1139430377511060_7339112946625226185_n.webp",
          },
          {
            title: "biographie",
            src: "https://bfteqciwfomtgqrutgve.supabase.co/storage/v1/object/public/medias/photos/430326676_1177290423647337_6090201498634445794_n.webp?t=2024-03-13T12%3A56%3A52.145Z",
          },
        ]}
        sectionTitle="Samuel freret"
      />
      <Resource
        value={albums}
        onResolved={(data) => (
          <>
            {data.map((album) => (
              <SectionAlbumPhoto
                key={album.id}
                title="Production photographique"
                subtitle={album.title}
                images={album.covers ?? []}
              />
            ))}
          </>
        )}
      />

      <ImageSlideGallery videos={videos.value} />
      <ContactSection />
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
