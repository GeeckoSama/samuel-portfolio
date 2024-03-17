import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { HiEyeSolid, HiPencilSquareSolid } from "@qwikest/icons/heroicons";
import type { Albums } from "@libs/photo.type";

export const TableRowAlbum = component$<{ albums: Albums }>((props) => {
  return (
    <>
      {props.albums.map((item) => (
        <tr key={item.id}>
          <th>
            {item.covers && (
              <img
                src={item.covers[0]}
                width={50}
                height={50}
                class="bg-base-300"
              />
            )}
          </th>
          <td>{item.title}</td>
          <td>{item.description}</td>
          <td>{item.photos ? item.photos.length : 0}</td>
          <td class="space-x-1">
            {item.localisations.map((localisation, index) => (
              <span key={index} class="badge badge-primary">
                {localisation}
              </span>
            ))}
          </td>
          <td>
            <Link href={"./" + item.id + "/photos"} class="btn btn-ghost">
              <HiEyeSolid class="h-6 w-6" />
            </Link>
            <Link href={"./" + item.id} class="btn btn-ghost">
              <HiPencilSquareSolid class="h-6 w-6" />
            </Link>
          </td>
        </tr>
      ))}
    </>
  );
});
