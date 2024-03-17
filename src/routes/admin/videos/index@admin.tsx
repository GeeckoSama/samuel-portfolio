import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { collection, onSnapshot } from "firebase/firestore";
import { Table } from "@components/table/table";
import { firestore } from "@libs/firebase";
import type { Video, Videos } from "@libs/video.type";

export default component$(() => {
  const videos = useSignal<Videos>([]);
  useTask$(() => {
    const collectionRef = collection(firestore, "videos");
    onSnapshot(collectionRef, (snapshot) => {
      console.log("snapshot", snapshot);
      const data = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Video;
      });
      videos.value = data;
    });
  });
  return (
    <div class="card mx-auto max-w-7xl bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title">Toutes les vidéos</h2>
        <Table photos={videos.value} />
      </div>
    </div>
  );
});
