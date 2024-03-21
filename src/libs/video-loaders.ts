/* eslint-disable qwik/loader-location */
import { routeLoader$ } from "@builder.io/qwik-city";
import { parse } from "valibot";
import type { Video } from "./video.type";
import { VideoShema } from "./video.type";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";

export const useVideoById = routeLoader$(async (requestEvent) => {
  try {
    const videoId = requestEvent.params.videoId;
    if (!videoId) {
      requestEvent.fail(404, { error: "No videoId provided" });
    }
    const docRef = doc(firestore(), `videos/${videoId}`);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
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
      const colRef = collection(firestore(), "videos");
      const snaps = await getDocs(colRef);
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
