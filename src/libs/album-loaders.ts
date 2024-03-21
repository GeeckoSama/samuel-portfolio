import { routeLoader$ } from "@builder.io/qwik-city";
import { parse, safeParse } from "valibot";
import type { Album } from "./photo.type";
import { AlbumShema } from "./photo.type";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";

// eslint-disable-next-line qwik/loader-location
export const useAlbumById = routeLoader$(async (requestEvent) => {
  try {
    const albumId = requestEvent.params.albumId;
    if (!albumId) {
      requestEvent.fail(404, { error: "No albumId provided" });
    }
    const docRef = doc(firestore(), `albums/${albumId}`);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      requestEvent.fail(404, { error: "No album found" });
    }
    const result = safeParse(AlbumShema, { id: snap.id, ...snap.data() });
    if (result.success) return result.output as Album;
    requestEvent.fail(500, { error: result.issues });
  } catch (error) {
    requestEvent.fail(500, { error: error });
  }
});

// eslint-disable-next-line qwik/loader-location
export const useAlbums = routeLoader$((requestEvent) => {
  return async () => {
    try {
      const colRef = collection(firestore(), "albums");
      const snaps = await getDocs(colRef);
      return snaps.docs.map((snap) => {
        return parse(AlbumShema, {
          id: snap.id,
          ...snap.data(),
        }) as Album;
      });
    } catch (error) {
      requestEvent.fail(500, { error: error });
    }
  };
});
