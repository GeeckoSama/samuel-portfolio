import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { ContactSection } from "@components/contact-section/contact-section";
import { HeroList } from "@components/hero-list/hero-list";
import { ImageSlideGallery } from "@components/image-slide-gallery/image-slide-gallery";
import { collection, getDocs } from "firebase/firestore";
import { parse, safeParse } from "valibot";
import { SectionAlbumPhoto } from "~/components/section-album-photo/section-album-photo";
import { firestore } from "~/libs/firebase";
import type { Albums } from "~/libs/photo.type";
import { AlbumShema, AlbumsShema } from "~/libs/photo.type";
import type { Videos } from "~/libs/video.type";
import { VideoShema, VideosShema } from "~/libs/video.type";

export default component$(() => {
  const albums = useSignal<Albums>([]);
  const videos = useSignal<Videos>([]);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const albumsRef = collection(firestore(), "albums");
    const videosRef = collection(firestore(), "videos");
    getDocs(albumsRef)
      .then((snapshot) => {
        const albumsData = safeParse(
          AlbumsShema,
          snapshot.docs.map((snap) =>
            parse(AlbumShema, { id: snap.id, ...snap.data() }),
          ),
        );
        if (albumsData.success) albums.value = albumsData.output;
        else console.error(albumsData.issues);
      })
      .catch(console.error);

    getDocs(videosRef)
      .then((snapshot) => {
        const videosData = safeParse(
          VideosShema,
          snapshot.docs.map((snap) =>
            parse(VideoShema, { id: snap.id, ...snap.data() }),
          ),
        );
        if (videosData.success) videos.value = videosData.output;
        else console.error(videosData.issues);
      })
      .catch(console.error);
  });
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
      {albums.value.map((album) => (
        <SectionAlbumPhoto
          key={album.id}
          title="Production photographique"
          subtitle={album.title}
          images={album.covers ?? []}
        />
      ))}

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
