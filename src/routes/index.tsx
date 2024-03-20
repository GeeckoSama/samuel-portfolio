import { Resource, component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { ContactSection } from "@components/contact-section/contact-section";
import { HeroList } from "@components/hero-list/hero-list";
import { ImageSlideGallery } from "@components/image-slide-gallery/image-slide-gallery";
import type { Album } from "@libs/photo.type";
import type { Video } from "@libs/video.type";
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

export const useVideos = routeLoader$(() => {
  return async () => {
    const collectionRef = collection(firestore, "videos");
    const videos = await getDocs(collectionRef).then((snapshot) => {
      return snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Video;
      });
    });
    return videos;
  };
});

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

      <Resource
        value={videos}
        onResolved={(data) => <ImageSlideGallery videos={data} />}
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
