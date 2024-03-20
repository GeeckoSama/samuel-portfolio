import { Resource, component$ } from "@builder.io/qwik";
import { Table } from "@components/table/table";
import { useAlbums } from "~/libs/album-loaders";

export { useAlbums } from "~/libs/album-loaders";

export default component$(() => {
  const albums = useAlbums();
  return (
    <div class="card mx-auto max-w-7xl bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title">Toutes les Albums</h2>
        <Resource
          value={albums}
          onResolved={(data) => <>{data && <Table albums={data} />}</>}
          onPending={() => <div class="loading-spinner">Loading...</div>}
        />
      </div>
    </div>
  );
});
