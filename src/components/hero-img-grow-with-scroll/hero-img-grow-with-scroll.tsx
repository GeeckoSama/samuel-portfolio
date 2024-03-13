import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "@images/ID.jpg?jsx";
import { GlyphText } from "../ui/glyph-text";

export interface HeroImgGrowWithScrollProps {
  imgAlt: string;
  text: string;
}

export const HeroImgGrowWithScroll = component$<HeroImgGrowWithScrollProps>(
  (props) => {
    const containerRef = useSignal<Element>();
    const imageRef = useSignal<Element>();
    const isMobile = useSignal<boolean>(false);

    useTask$(() => {
      if (isServer) return;
      isMobile.value = window.innerWidth < 768;
      if (isMobile.value) return;
      const context = gsap.context(() => {
        gsap.registerPlugin(ScrollTrigger);
        gsap
          .timeline({
            scrollTrigger: {
              trigger: containerRef.value,
              start: "top top",
              end: "bottom top+=1080px",
              scrub: true,
            },
          })
          .fromTo(
            imageRef.value!,
            {
              scale: 0.1,
            },
            {
              scale: 1,
            },
          );
      });
      return () => context.revert();
    });

    return (
      <div ref={containerRef} class="h-screen bg-base-100 lg:h-[200vh]">
        <Image
          ref={imageRef}
          class="h-[100vh] w-full translate-x-1/4 object-contain object-center lg:sticky lg:top-0 lg:translate-x-0 lg:scale-[0.1]"
          alt={props.imgAlt}
        />
        <h2 class="invert-1 absolute left-[-16vh] top-[51vh] ml-8 -rotate-90 text-2xl font-black uppercase tracking-widest text-neutral-100 mix-blend-difference lg:sticky lg:bottom-[0vh] lg:top-[50vh] lg:rotate-0 lg:text-8xl">
          {isMobile.value ? (
            <h2>{props.text}</h2>
          ) : (
            <GlyphText text={props.text} />
          )}
        </h2>
      </div>
    );
  },
);
