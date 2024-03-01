import { $, component$, useSignal } from "@builder.io/qwik";
import { gsap } from "gsap";

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
    <main class="flex h-screen content-center items-center bg-base-100">
      <div class="mx-auto w-[70%]">
        <p>{props.sectionTitle}</p>

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
    <div
      class="flex w-full cursor-pointer items-center justify-center border-t-2 border-neutral-950 pb-[0.8vw] pt-[0.8vw] last-of-type:border-b-2"
      onMouseEnter$={handleMouseEnter}
      onMouseLeave$={handleMouseLeave}
    >
      <p class="mr-[0.75vw] text-3xl font-bold">{props.project.title1}</p>

      <div class="flex justify-center overflow-hidden">
        <img
          ref={imgRef}
          src={props.project.src}
          width={1740}
          height={1160}
          class="h-[5vw] w-0"
        />
      </div>

      <p class="ml-[0.75vw] text-3xl font-bold">{props.project.title2}</p>
    </div>
  );
});
