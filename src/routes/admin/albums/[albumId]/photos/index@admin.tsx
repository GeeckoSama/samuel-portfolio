import { Resource, component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Table } from "@components/table/table";
import { firestore } from "@libs/firebase";
import type { Photo } from "@libs/photo.type";
import { collection, getDocs } from "firebase/firestore";

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
  const photos = usePhotos();
  return (
    <div class="card mx-auto max-w-7xl bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title">Toutes les photos</h2>
        <Resource
          value={photos}
          onResolved={(data) => <Table photos={data} />}
          onPending={() => <div class="loading-spinner">Loading...</div>}
        />
      </div>
    </div>
  );
});
