/* eslint-disable qwik/loader-location */
import { routeLoader$ } from "@builder.io/qwik-city";
import { parse } from "valibot";
import { getAdminFirestore } from "./firebase-admin";
import type { Video } from "./video.type";
import { VideoShema } from "./video.type";

export const useVideoById = routeLoader$(async (requestEvent) => {
  try {
    const videoId = requestEvent.params.videoId;
    if (!videoId) {
      requestEvent.fail(404, { error: "No videoId provided" });
    }
    const snap = await getAdminFirestore().doc(`videos/${videoId}`).get();
    if (!snap.exists) {
      requestEvent.fail(404, { error: "No video found" });
    }
    return parse(VideoShema, { id: snap.id, ...snap.data() }) as Video;
  } catch (error) {
    requestEvent.fail(500, { error: error });
  }
});

export const useVideos = routeLoader$((requestEvent) => {
  return async () => {
    try {
      const snaps = await getAdminFirestore().collection("videos").get();
      return snaps.docs.map(
        (snap) =>
          parse(VideoShema, {
            id: snap.id,
            ...snap.data(),
          }) as Video,
      );
    } catch (error) {
      requestEvent.fail(500, { error: error });
    }
  };
});
