import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Photos, Videos } from "~/types/photo";
import { HiPencilSquareSolid, HiPlusSolid } from "@qwikest/icons/heroicons";

export const Table = component$<{data: Photos | Videos}>((props) => {
  return (
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Média</th>
            <th>Titre</th>
            <th>Description</th>
            <th><Link href="./create" class="btn btn-ghost"><HiPlusSolid class="h-6 w-6" /></Link></th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((item) => (
            <tr key={item.id}>
              <th>
                <img src={item.url ?? ""} width={50} height={50} class="bg-base-300 rounded" />
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
        </tbody>
      </table>
    </div>
  );
});
