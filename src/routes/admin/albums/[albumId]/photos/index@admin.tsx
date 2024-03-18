import { Resource, component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { Table } from "@components/table/table";
import { firestore } from "@libs/firebase";
import type { Album, Photo } from "@libs/photo.type";
import { HiArrowLeftSolid } from "@qwikest/icons/heroicons";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export const useAlbum = routeLoader$(async (requestEvent) => {
  const albumId = requestEvent.params.albumId;
  const docRef = doc(firestore, `albums/${albumId}`);
  const snapshot = await getDoc(docRef);
  return { id: snapshot.id, ...snapshot.data() } as Album;
});

export const usePhotos = routeLoader$(async (requestEvent) => {
  return async () => {
    const albumId = requestEvent.params.albumId;
    const collectionRef = collection(firestore, `albums/${albumId}/photos`);
    const snapshot = await getDocs(collectionRef);
    const data = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as Photo;
    });
    return data;
  };
});

export default component$(() => {
  const album = useAlbum();
  const photos = usePhotos();
  return (
    <div class="card mx-auto max-w-7xl bg-base-100 shadow-md">
      <div class="card-body">
        <div class="flex space-x-1">
          <Link href="/admin/albums" class="btn btn-ghost">
            <HiArrowLeftSolid class="h-6 w-6" />
          </Link>
          <h2 class="card-title">Photos de l'album {album.value.title}</h2>
        </div>
        <Resource
          value={photos}
          onResolved={(data) => <Table photos={data} />}
          onPending={() => <div class="loading-spinner">Loading...</div>}
        />
      </div>
    </div>
  );
});
