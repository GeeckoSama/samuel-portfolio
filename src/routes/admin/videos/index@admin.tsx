import { Resource, component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Table } from "@components/table/table";
import { firestore } from "@libs/firebase";
import type { Video } from "@libs/video.type";
import { collection, getDocs } from "firebase/firestore";

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
  const videos = useVideos();
  return (
    <div class="card mx-auto max-w-7xl bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title">Toutes les vidéos</h2>
        <Resource
          value={videos}
          onResolved={(data) => <Table videos={data} />}
        />
      </div>
    </div>
  );
});
