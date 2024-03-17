import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Albums, Photos } from "@libs/photo.type";
import type { Videos } from "@libs/video.type";
import { HiPlusSolid } from "@qwikest/icons/heroicons";
import { TableRowAlbum } from "./table-row-album";
import { TableRowPhoto } from "./table-row-photo";
import { TableRowVideo } from "./table-row-video";

export const Table = component$<{
  albums?: Albums;
  photos?: Photos;
  videos?: Videos;
}>((props) => {
  return (
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th>Titre</th>
            <th>Description</th>
            {props.albums && <th>Nb photos</th>}
            <th>
              <Link href="./create" class="btn btn-ghost">
                <HiPlusSolid class="h-6 w-6" />
              </Link>
            </th>
          </tr>
        </thead>
        <tbody>
          {props.albums && <TableRowAlbum albums={props.albums} />}
          {props.photos && <TableRowPhoto photos={props.photos} />}
          {props.videos && <TableRowVideo videos={props.videos} />}
        </tbody>
      </table>
    </div>
  );
});
