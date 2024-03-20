import { Resource, component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Table } from "@components/table/table";
import { HiArrowLeftSolid } from "@qwikest/icons/heroicons";
import { useAlbumById } from "~/libs/album-loaders";
import { usePhotos } from "~/libs/photo-loaders";

export { useAlbumById } from "~/libs/album-loaders";
export { usePhotos } from "~/libs/photo-loaders";

export default component$(() => {
  const album = useAlbumById();
  const photos = usePhotos();
  return (
    <div class="card mx-auto max-w-7xl bg-base-100 shadow-md">
      <div class="card-body">
        <div class="flex space-x-1">
          <Link href="/admin/albums" class="btn btn-ghost">
            <HiArrowLeftSolid class="h-6 w-6" />
          </Link>
          <h2 class="card-title">Photos de l'album {album.value?.title}</h2>
        </div>
        <Resource
          value={photos}
          onResolved={(data) => <Table photos={data} />}
          onPending={() => <div class="loading-spinner">Loading...</div>}
        />
      </div>
    </div>
  );
});
