import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Album, Albums } from "@libs/photo.type";
import { HiEyeSolid, HiPencilSquareSolid } from "@qwikest/icons/heroicons";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "~/libs/firebase";

export const TableRowAlbum = component$<{ albums: Albums }>((props) => {
  const getPhotosNumber = async (album: Album) => {
    const collectionRef = collection(firestore(), `albums/${album.id}/photos`);
    return getDocs(collectionRef).then((snapshot) => {
      return snapshot.size;
    });
  };

  return (
    <>
      {props.albums.map(async (item) => (
        <tr key={item.id}>
          <th>
            {item.covers && (
              <img
                src={import.meta.env.PUBLIC_IMGIX_URL + item.covers[0]}
                width={50}
                height={50}
                class="bg-base-300"
              />
            )}
          </th>
          <td>{item.title}</td>
          <td>{item.description}</td>
          <td>{getPhotosNumber(item)}</td>
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
