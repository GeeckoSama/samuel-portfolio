import { routeLoader$ } from "@builder.io/qwik-city";
import { parse, safeParse } from "valibot";
import { adminFirestore } from "./firebase-admin";
import type { Photo } from "./photo.type";
import { PhotoShema } from "./photo.type";

// eslint-disable-next-line qwik/loader-location
export const usePhotoById = routeLoader$(async (requestEvent) => {
  try {
    const albumId = requestEvent.params.albumId;
    const photoId = requestEvent.params.photoId;
    if (!albumId) {
      requestEvent.fail(404, { error: "No albumId provided" });
    }
    if (!photoId) {
      requestEvent.fail(404, { error: "No photoId provided" });
    }
    const snap = await adminFirestore
      .doc(`albums/${albumId}/photos/${photoId}`)
      .get();
    if (!snap.exists) {
      requestEvent.fail(404, { error: "No photo found" });
    }
    const result = safeParse(PhotoShema, { id: snap.id, ...snap.data() });
    if (result.success) return result.output as Photo;
    requestEvent.fail(500, { error: result.issues });
  } catch (error) {
    requestEvent.fail(500, { error: error });
  }
});

// eslint-disable-next-line qwik/loader-location
export const usePhotos = routeLoader$((requestEvent) => {
  return async () => {
    try {
      const albumId = requestEvent.params.albumId;
      if (!albumId) {
        requestEvent.fail(404, { error: "No albumId provided" });
      }
      const snaps = await adminFirestore
        .collection(`albums/${albumId}/photos`)
        .get();
      return snaps.docs.map((snap) => {
        return parse(PhotoShema, {
          id: snap.id,
          ...snap.data(),
        }) as Photo;
      });
    } catch (error) {
      requestEvent.fail(500, { error: error });
    }
  };
});
