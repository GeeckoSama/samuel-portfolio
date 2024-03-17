import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { collection, onSnapshot } from "firebase/firestore";
import { Table } from "@components/table/table";
import { firestore } from "@libs/firebase";
import type { Album, Albums } from "@libs/photo.type";

export default component$(() => {
  const albums = useSignal<Albums>([]);
  useTask$(() => {
    const collectionRef = collection(firestore, "albums");
    onSnapshot(collectionRef, (snapshot) => {
      console.log("snapshot", snapshot);
      const data = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Album;
      });
      albums.value = data;
    });
  });
  return (
    <div class="card mx-auto max-w-7xl bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title">Toutes les Albums</h2>
        <Table albums={albums.value} />
      </div>
    </div>
  );
});
