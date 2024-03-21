import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import { Table } from "@components/table/table";
import { collection, onSnapshot } from "firebase/firestore";
import { parse } from "valibot";
import { firestore } from "~/libs/firebase";
import type { Album, Albums } from "~/libs/photo.type";
import { AlbumShema } from "~/libs/photo.type";

export default component$(() => {
  const albums = useSignal<Albums>([]);
  useTask$(({ cleanup }) => {
    if (isServer) return;
    const colRef = collection(firestore(), "albums");
    const unsubscribe = onSnapshot(colRef, (snap) => {
      console.log("snap size : ", snap.size);
      albums.value = snap.docs.map((doc) => {
        return parse(AlbumShema, { id: doc.id, ...doc.data() }) as Album;
      });
    });

    cleanup(() => {
      console.log("cleanup albums");
      unsubscribe();
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
