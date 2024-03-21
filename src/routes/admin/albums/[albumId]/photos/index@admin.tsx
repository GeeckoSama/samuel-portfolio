import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Table } from "@components/table/table";
import { HiArrowLeftSolid } from "@qwikest/icons/heroicons";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { parse, safeParse } from "valibot";
import { firestore } from "~/libs/firebase";
import type { Album, Photo, Photos } from "~/libs/photo.type";
import { AlbumShema, PhotoShema } from "~/libs/photo.type";

export default component$(() => {
  const loc = useLocation();
  const album = useSignal<Album>();

  const photos = useSignal<Photos>([]);
  useTask$(async ({ cleanup }) => {
    const albumId = loc.params.albumId;
    if (!albumId) return;
    const albumRef = doc(firestore(), `albums/${albumId}`);
    const snap = await getDoc(albumRef);
    const data = safeParse(AlbumShema, { id: snap.id, ...snap.data() });
    if (data.success) album.value = data.output;
    else console.error(data.issues);
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
