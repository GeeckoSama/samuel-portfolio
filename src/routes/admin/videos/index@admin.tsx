import { Resource, component$ } from "@builder.io/qwik";
import { Table } from "@components/table/table";
import { useVideos } from "~/libs/video-loaders";

export { useVideos } from "~/libs/video-loaders";

export default component$(() => {
  const videos = useVideos();
  return (
    <div class="card mx-auto max-w-7xl bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title">Toutes les vidéos</h2>
        <Resource
          value={videos}
          onResolved={(data) => <>{data && <Table videos={data} />}</>}
        />
      </div>
    </div>
  );
});
