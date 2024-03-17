import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Videos } from "@libs/video.type";
import { HiPencilSquareSolid } from "@qwikest/icons/heroicons";

export const TableRowVideo = component$<{ videos: Videos }>((props) => {
  return (
    <>
      {props.videos.map((item) => (
        <tr key={item.id}>
          <th>
            <img src={item.cover} width={50} height={50} class="bg-base-300" />
          </th>
          <td>{item.title}</td>
          <td>{item.description}</td>
          <td>
            {item.localisations?.map((localisation, index) => (
              <span key={index} class="badge badge-primary">
                {localisation}
              </span>
            ))}
          </td>
          <td>
            <Link href={"./" + item.id} class="btn btn-ghost">
              <HiPencilSquareSolid class="h-6 w-6" />
            </Link>
          </td>
        </tr>
      ))}
    </>
  );
});
