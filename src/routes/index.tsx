import { Resource, component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { ContactSection } from "@components/contact-section/contact-section";
import { HeroList } from "@components/hero-list/hero-list";
import { ImageSlideGallery } from "@components/image-slide-gallery/image-slide-gallery";
import { SectionAlbumPhoto } from "~/components/section-album-photo/section-album-photo";
import { useAlbums } from "@libs/album-loaders";
import { useVideos } from "@libs/video-loaders";

export { useAlbums } from "@libs/album-loaders";
export { useVideos } from "@libs/video-loaders";

export default component$(() => {
  const albums = useAlbums();
  const videos = useVideos();
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
            {data &&
              data.map((album) => (
                <SectionAlbumPhoto
                  key={album.id}
                  title="Production photographique"
                  subtitle={album.title}
                  images={album.covers ?? []}
                />
              ))}
          </>
        )}
        onRejected={(error) => <div>{error.message}</div>}
      />

      <Resource
        value={videos}
        onResolved={(data) => data && <ImageSlideGallery videos={data} />}
        onRejected={(error) => <div>{error.message}</div>}
      />

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
