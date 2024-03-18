import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Photos } from "@libs/photo.type";
import { HiPencilSquareSolid } from "@qwikest/icons/heroicons";
import { Image } from "@unpic/qwik";

export const TableRowPhoto = component$<{ photos: Photos }>((props) => {
  return (
    <>
      {props.photos.map((item) => (
        <tr key={item.id}>
          <th>
            <Image
              src={import.meta.env.PUBLIC_IMGIX_URL + item.path}
              layout="constrained"
              class="h-14 w-auto bg-base-300"
              height={56}
              width={56}
            />
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
