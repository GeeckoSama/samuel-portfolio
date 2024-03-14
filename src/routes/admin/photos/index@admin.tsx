import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Table } from "@components/table/table";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "@libs/firebase";
import type { Photo, Photos } from "@libs/photo.type";

export default component$(() => {
  //const photos = usePhotos();
  const photos = useSignal<Photos>([]);
  useTask$(() => {
    const collectionRef = collection(firestore, "photos");
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
        <Table data={photos.value} />
      </div>
    </div>
  );
});
