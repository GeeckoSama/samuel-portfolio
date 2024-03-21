import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Table } from "@components/table/table";
import { collection, onSnapshot } from "firebase/firestore";
import { parse } from "valibot";
import { firestore } from "~/libs/firebase";
import type { Video, Videos } from "~/libs/video.type";
import { VideoShema } from "~/libs/video.type";

export default component$(() => {
  const videos = useSignal<Videos>([]);
  useTask$(({ cleanup }) => {
    const colRef = collection(firestore(), "videos");
    const unsubscribe = onSnapshot(colRef, (snap) => {
      console.log("snap size : ", snap.size);
      videos.value = snap.docs.map((doc) => {
        return parse(VideoShema, { id: doc.id, ...doc.data() }) as Video;
      });
    });

    cleanup(() => {
      unsubscribe();
    });
  });
  return (
    <div class="card mx-auto max-w-7xl bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title">Toutes les vidéos</h2>
        <Table videos={videos.value} />
      </div>
    </div>
  );
});
