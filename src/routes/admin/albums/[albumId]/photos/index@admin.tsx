import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Table } from "@components/table/table";
import { HiArrowLeftSolid } from "@qwikest/icons/heroicons";
import { collection, onSnapshot } from "firebase/firestore";
import { parse } from "valibot";
import { useAlbumById } from "~/libs/album-loaders";
import { firestore } from "~/libs/firebase";
import type { Photo, Photos } from "~/libs/photo.type";
import { PhotoShema } from "~/libs/photo.type";

export { useAlbumById } from "~/libs/album-loaders";

export default component$(() => {
  const album = useAlbumById();

  const photos = useSignal<Photos>([]);
  useTask$(({ cleanup }) => {
    if (!album.value) return;
    const colRef = collection(firestore(), `albums/${album.value.id}/photos`);
    const unsubscribe = onSnapshot(colRef, (snap) => {
      console.log("snap size : ", snap.size);
      photos.value = snap.docs.map((doc) => {
        return parse(PhotoShema, { id: doc.id, ...doc.data() }) as Photo;
      });
    });

    cleanup(() => {
      unsubscribe();
    });
  });
  return (
    <div class="card mx-auto max-w-7xl bg-base-100 shadow-md">
      <div class="card-body">
        <div class="flex space-x-1">
          <Link href="/admin/albums" class="btn btn-ghost">
            <HiArrowLeftSolid class="h-6 w-6" />
          </Link>
          <h2 class="card-title">Photos de l'album {album.value?.title}</h2>
        </div>
        <Table photos={photos.value} />
      </div>
    </div>
  );
});
