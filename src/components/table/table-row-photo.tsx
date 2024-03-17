import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Photos } from "@libs/photo.type";
import { HiPencilSquareSolid } from "@qwikest/icons/heroicons";

export const TableRowPhoto = component$<{ photos: Photos }>((props) => {
  return (
    <>
      {props.photos.map((item) => (
        <tr key={item.id}>
          <th>
            <img src={item.path} width={50} height={50} class="bg-base-300" />
          </th>
          <td>{item.title}</td>
          <td>{item.description}</td>
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
