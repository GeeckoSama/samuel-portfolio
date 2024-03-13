import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image1 from "@images/paysage_1.jpg?jsx";
import Image2 from "@images/paysage_2.jpg?jsx";
import Image3 from "@images/paysage_3.jpg?jsx";

export interface HeroParallaxScrollProps {
  title: string;
  word: string;
  images: string[];
}

export const HeroParallaxScroll = component$<HeroParallaxScrollProps>(
  (props) => {
    const containerRef = useSignal<Element>();
    const titleRef = useSignal<Element>();
    const lettersRefs = useSignal<Element[]>([]);
    const imagesRefs = useSignal<Element[]>([]);

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        const tl = gsap
          .timeline({
            scrollTrigger: {
              trigger: containerRef.value,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          })
          .to(titleRef, { y: -50 }, 0)
          .to(imagesRefs.value[1], { y: -150 }, 0)
          .to(imagesRefs.value[2], { y: -255 }, 0);
        lettersRefs.value.forEach((letter) => {
          tl.to(
            letter,
            {
              top: Math.floor(Math.random() * 50),
            },
            0,
          );
        });
      });
      return () => context.revert();
    });

    return (
      <div ref={containerRef} class="my-[10vh] min-h-screen">
        <div class="ml-[10vw]">
          <h2 ref={titleRef} class="m-0 mt-2 text-xl font-semibold uppercase">
            {props.title}
          </h2>
          <div>
            <p class="m-0 mt-2 text-xl font-medium uppercase">
              {props.word.split("").map((letter, i) => {
                return (
                  <span
                    key={`l_${i}`}
                    ref={(el) => (lettersRefs.value[i] = el)}
                    class="relative z-40"
                  >
                    {letter}
                  </span>
                );
              })}
            </p>
          </div>
        </div>

        <div class="relative mt-[5vh] flex w-full content-center justify-center">
          <div
            ref={(el) => (imagesRefs.value[0] = el)}
            class="absolute z-10 h-[80vh] w-screen lg:w-[80vw]"
          >
            <Image1 class="h-full w-auto  object-cover object-center shadow-lg" />
          </div>
          <div
            ref={(el) => (imagesRefs.value[1] = el)}
            class="absolute right-[5vw] top-[10vh] z-20 h-[25vh] w-[20vh] lg:h-[50vh] lg:w-[40vh]"
          >
            <Image2 class=" h-full w-auto  object-cover object-center shadow-xl" />
          </div>
          <div
            ref={(el) => (imagesRefs.value[2] = el)}
            class="absolute left-[10vw] top-[75vh] z-30 h-[20vh] w-[20vh] lg:h-[45vh] lg:w-[40vh]"
          >
            <Image3 class=" h-full w-auto  object-cover object-center shadow-2xl" />
          </div>
        </div>
      </div>
    );
  },
);
