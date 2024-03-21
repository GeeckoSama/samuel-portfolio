import { routeLoader$ } from "@builder.io/qwik-city";
import { parse, safeParse } from "valibot";
import type { Album } from "./photo.type";
import { AlbumShema } from "./photo.type";
import { getAdminFirestore } from "./firebase-admin";

// eslint-disable-next-line qwik/loader-location
export const useAlbumById = routeLoader$(async (requestEvent) => {
  try {
    const albumId = requestEvent.params.albumId;
    if (!albumId) {
      requestEvent.fail(404, { error: "No albumId provided" });
    }
    const snap = await getAdminFirestore().doc(`albums/${albumId}`).get();
    if (!snap.exists) {
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
      const snaps = await getAdminFirestore().collection("albums").get();
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
