import { component$, useSignal, $ } from "@builder.io/qwik";
import { GlyphText } from "../ui/glyph-text";
import gsap from "gsap";

export interface HeroListProps {
  projects: {
    title: string;
    src: string;
  }[];
  sectionTitle: string;
}

export const HeroList = component$<HeroListProps>((props) => {
  const imageRef = useSignal<HTMLImageElement>();
  const selectedProject = useSignal<number>(0);
  const handleHover = $((index: number) => {
    if (index === selectedProject.value) return;
    /* gsap.to(imageRef.value!, {
      opacity: 0,
      scale: 0.9,
      translateX: -100,
      duration: 0.1,
      ease: "expo.out",
    });
    setTimeout(() => {
      selectedProject.value = index;
      gsap.to(imageRef.value!, {
        opacity: 1,
        scale: 1,
        translateX: 0,
        duration: 0.2,
        ease: "expo.in",
      });
    }, 100); */
    selectedProject.value = index;
    gsap.fromTo(
      imageRef.value!,
      { opacity: 0, filter: `blur(${Math.random() * 100}px) hue-rotate(${Math.random() * 360}deg)` },
      { opacity: 1, filter: "blur(0px) hue-rotate(0deg)", duration: 0.3, ease: "expo.out" },
    );
  });
  return (
    <main class="grid h-screen grid-cols-2 content-center items-center gap-2 bg-base-100 xl:grid-cols-3">
      <div class="mx-auto max-w-[50vw] xl:col-span-2">
        <img
          ref={imageRef}
          src={props.projects[selectedProject.value].src}
          alt=""
          width={1920}
          height={1080}
          class="h-full w-full rounded-box object-cover shadow-lg"
        />
      </div>
      <div class="">
        {props.projects.map((project, i) => {
          return (
            <div
              key={i}
              onMouseOver$={() => handleHover(i)}
              class="cursor-pointer items-center justify-center border-t border-neutral-950 pb-[0.8vw] pt-[0.8vw] text-[3vw] font-bold last-of-type:border-b dark:border-neutral-100"
            >
              <GlyphText text={project.title} />
            </div>
          );
        })}
      </div>
    </main>
  );
});
