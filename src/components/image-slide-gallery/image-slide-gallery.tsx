import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { gsap } from "gsap";
import { GlyphText } from "../ui/glyph-text";
import { Link } from "@builder.io/qwik-city";
import type { Video, Videos } from "@libs/video.type";
import { Image } from "@unpic/qwik";

export const ImageSlideGallery = component$<{ videos: Videos }>((props) => {
  return (
    <main class="flex h-screen content-center items-center">
      <div class="mx-auto w-screen lg:w-[70%]">
        <div class="mb-10 text-2xl font-bold uppercase">
          <GlyphText text="Clip vidéos" />
        </div>

        {props.videos.map((project, i) => {
          return <Project key={i} video={project} />;
        })}
      </div>
    </main>
  );
});

export interface ProjectProps {
  project: {
    title1: string;
    title2: string;
    src: string;
  };
}

export const Project = component$<{ video: Video }>((props) => {
  const cdn = import.meta.env.PUBLIC_IMGIX_URL;
  const imgRef = useSignal<HTMLImageElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    gsap.to(imgRef.value!, {
      width: 0,
      duration: 0,
    });
  });

  const handleMouseEnter = $(() => {
    gsap.to(imgRef.value!, {
      width: "auto",
      duration: 0.4,
      ease: "power2.out",
    });
  });

  const handleMouseLeave = $(() => {
    gsap.to(imgRef.value!, {
      width: 0,
      duration: 0.5,
    });
  });
  3;
  return (
    <Link
      href={`/videos/${props.video.id}`}
      class="flex w-full cursor-pointer items-center justify-center border-t border-neutral-950 pb-[0.8vw] pt-[0.8vw] last-of-type:border-b"
      onMouseEnter$={handleMouseEnter}
      onMouseLeave$={handleMouseLeave}
    >
      <p class="mr-[0.75vw] text-xl font-bold lg:text-2xl xl:text-3xl">
        {props.video.title.slice(0, Math.round(props.video.title.length / 2))}
      </p>

      <div class="flex justify-center overflow-hidden">
        <Image
          ref={imgRef}
          src={cdn + props.video.cover}
          alt={props.video.title}
          layout="constrained"
          width={500}
          height={250}
          class="h-[7vw] w-0 shadow-md"
        />
      </div>

      <p class="ml-[0.75vw] text-xl font-bold lg:text-2xl xl:text-3xl">
        {props.video.title.slice(
          Math.round(props.video.title.length / 2),
          props.video.title.length,
        )}
      </p>
    </Link>
  );
});
