import { component$, useSignal, $ } from "@builder.io/qwik";
import { GlyphText } from "../ui/glyph-text";
import gsap from "gsap";
import { Link } from "@builder.io/qwik-city";

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
    selectedProject.value = index;
    gsap.fromTo(
      imageRef.value!,
      {
        opacity: 0,
        filter: `blur(${Math.random() * 100}px) hue-rotate(${Math.random() * 360}deg)`,
      },
      {
        opacity: 1,
        filter: "blur(0px) hue-rotate(0deg)",
        duration: 0.3,
        ease: "expo.out",
      },
    );
  });

  return (
    <section class="grid h-screen grid-cols-1 gap-2 lg:grid-cols-2 lg:content-center lg:items-center">
      <div class="flex justify-end lg:h-[87vh]">
        <img
          ref={imageRef}
          src={props.projects[selectedProject.value].src}
          alt=""
          width={580}
          height={720}
          class="h-full w-auto object-cover"
        />
      </div>
      <div class="">
        <h1 class="mb-14 text-2xl font-extrabold uppercase underline lg:mb-[66%]">
          {props.sectionTitle}
        </h1>
        {props.projects.map((project, i) => {
          return (
            <Link key={i} href="#">
              <div
                onMouseOver$={() => handleHover(i)}
                class="cursor-pointer items-center justify-center border-t border-neutral-950 pb-[0.8vw] pt-[0.8vw] text-xl font-bold last-of-type:border-b dark:border-neutral-100"
              >
                <GlyphText text={project.title} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
});
