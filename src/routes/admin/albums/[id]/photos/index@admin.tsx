import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Table } from "@components/table/table";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "@libs/firebase";
import type { Photo, Photos } from "@libs/photo.type";
import { routeLoader$ } from "@builder.io/qwik-city";

export const useAlbumsId = routeLoader$(async (requestEvent) => {
  return requestEvent.params.albumId;
});

export default component$(() => {
  const albumsId = useAlbumsId();
  const photos = useSignal<Photos>([]);
  useTask$(() => {
    const collectionRef = collection(firestore, `albums/${albumsId}/photos`);
    onSnapshot(collectionRef, (snapshot) => {
      console.log("snapshot", snapshot);
      const data = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Photo;
      });
      photos.value = data;
    });
  });
  return (
    <div class="card mx-auto max-w-7xl bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title">Toutes les photos</h2>
        <Table photos={photos.value} />
      </div>
    </div>
  );
});
