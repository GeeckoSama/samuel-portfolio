import { Resource, component$ } from "@builder.io/qwik";
import { HeroMaskOnscroll } from "~/components/hero-mask-onscroll/hero-mask-onscroll";
import { useVideoById } from "~/libs/video-loaders";

export { useVideoById } from "~/libs/video-loaders";

export default component$(() => {
  const video = useVideoById();
  return (
    <main>
      <Resource
        value={video}
        onResolved={(data) => (
          <>
            {data && <HeroMaskOnscroll video={data} />}
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
                <h1 class="mb-8 text-3xl font-bold">{data?.title}</h1>
                <p class="mb-4 text-lg font-medium">{data?.description}</p>
                <span class="text-end text-base font-normal">
                  {data && new Date(data.production_date).toLocaleDateString()}
                </span>
                <h2 class="mt-4 text-lg font-bold">Credits</h2>
                <ul>
                  {data?.credits.map((credit, index) => (
                    <li key={index}>{credit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      />
    </main>
  );
});
