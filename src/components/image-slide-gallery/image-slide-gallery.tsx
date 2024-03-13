import { $, component$, useSignal } from "@builder.io/qwik";
import { gsap } from "gsap";
import { GlyphText } from "../ui/glyph-text";
import { Link } from "@builder.io/qwik-city";

export interface ImageSlideGalleryProps {
  projects: {
    title1: string;
    title2: string;
    src: string;
  }[];
  sectionTitle: string;
}

export const ImageSlideGallery = component$<ImageSlideGalleryProps>((props) => {
  return (
    <main class="flex h-screen content-center items-center">
      <div class="mx-auto w-screen lg:w-[70%]">
        <div class="mb-10 text-2xl font-bold uppercase">
          <GlyphText text={props.sectionTitle} />
        </div>

        {props.projects.map((project, i) => {
          return <Project key={i} project={project} />;
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

export const Project = component$<ProjectProps>((props) => {
  const imgRef = useSignal<HTMLImageElement>();

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
      href="#"
      class="flex w-full cursor-pointer items-center justify-center border-t border-neutral-950 pb-[0.8vw] pt-[0.8vw] last-of-type:border-b dark:border-neutral-100"
      onMouseEnter$={handleMouseEnter}
      onMouseLeave$={handleMouseLeave}
    >
      <p class="mr-[0.75vw] text-xl font-bold lg:text-3xl">
        {props.project.title1}
      </p>

      <div class="flex justify-center overflow-hidden">
        <img
          ref={imgRef}
          src={props.project.src}
          width={1740}
          height={1160}
          class="h-[7vw] w-0 shadow-md"
        />
      </div>

      <p class="ml-[0.75vw] text-xl font-bold lg:text-3xl">
        {props.project.title2}
      </p>
    </Link>
  );
});
