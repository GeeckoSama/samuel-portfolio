import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { HeroMaskOnscroll } from "@components/hero-mask-onscroll/hero-mask-onscroll";
import { firestore } from "@libs/firebase";
import type { Video } from "@libs/video.type";
import { VideoShema } from "@libs/video.type";
import { doc, getDoc } from "firebase/firestore";
import { safeParse } from "valibot";

export default component$(() => {
  const loc = useLocation();
  const video = useSignal<Video | null>(null);

  useTask$(() => {
    const videoId = loc.params.videoId;
    if (!videoId) return;
    const videoRef = doc(firestore(), `videos/${videoId}`);
    getDoc(videoRef).then((snap) => {
      if (snap.exists()) {
        const data = safeParse(VideoShema, {
          id: snap.id,
          ...snap.data(),
        });
        if (data.success) video.value = data.output;
        else console.error(data.issues);
      }
    });
  });
  return (
    <main>
      {video.value && <HeroMaskOnscroll video={video.value} />}
      <div class="my-10 flex items-center justify-center gap-4">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube-nocookie.com/embed/y_BZbHtaf0c?si=mSQ6sdeOfPAVG2L9"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullscreen
          class="mx-auto h-96 w-full"
        ></iframe>
        <div class="container mx-auto flex flex-col py-12">
          <h1 class="mb-8 text-3xl font-bold">{video.value?.title}</h1>
          <p class="mb-4 text-lg font-medium">{video.value?.description}</p>
          <span class="text-end text-base font-normal">
            {video.value &&
              new Date(video.value.production_date).toLocaleDateString()}
          </span>
          <h2 class="mt-4 text-lg font-bold">Credits</h2>
          <ul>
            {video.value?.credits.map((credit, index) => (
              <li key={index}>{credit}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
});
