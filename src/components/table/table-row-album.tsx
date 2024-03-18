import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Album, Albums } from "@libs/photo.type";
import { HiEyeSolid, HiPencilSquareSolid } from "@qwikest/icons/heroicons";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firestore } from "~/libs/firebase";

export const TableRowAlbum = component$<{ albums: Albums }>((props) => {
  const getPhotosNumber = async (album: Album) => {
    const collectionRef = collection(firestore, `albums/${album.id}/photos`);
    return getDocs(collectionRef).then((snapshot) => {
      return snapshot.size;
    });
  };

  const getPhotoPath = async (album: Album) => {
    if (!album.covers) return;
    const docRef = doc(
      firestore,
      `albums/${album.id}/photos/${album.covers[0]}`,
    );
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data().path;
    }
    return;
  };

  return (
    <>
      {props.albums.map(async (item) => (
        <tr key={item.id}>
          <th>
            {item.covers && (
              <img
                src={import.meta.env.PUBLIC_IMGIX_URL + await getPhotoPath(item)}
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
