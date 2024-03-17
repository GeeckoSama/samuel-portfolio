import { Resource, component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Table } from "@components/table/table";
import { firestore } from "@libs/firebase";
import type { Album } from "@libs/photo.type";
import { collection, getDocs } from "firebase/firestore";

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

export default component$(() => {
  const albums = useAlbums();
  return (
    <div class="card mx-auto max-w-7xl bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title">Toutes les Albums</h2>
        <Resource
          value={albums}
          onResolved={(data) => <Table albums={data} />}
          onPending={() => <div class="loading-spinner">Loading...</div>}
        />
      </div>
    </div>
  );
});
