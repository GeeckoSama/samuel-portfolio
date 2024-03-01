import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlyphText } from "../ui/GlyphText";
import Image from "../../media/ID.jpg?jsx";

export interface HeroImgGrowWithScrollProps {
  imgAlt: string;
  text: string;
}

export const HeroImgGrowWithScroll = component$<HeroImgGrowWithScrollProps>(
  (props) => {
    const isMobile = useSignal<boolean>(false);
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      isMobile.value = window.innerWidth < 768;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: "#hero-container-grow",
        start: "top top",
        end: "bottom 50%+=1080px",
        scrub: true,
        onUpdate: (self) => {
          const scale = (Math.floor(self.progress * 100) + 10) / 100;
          gsap.to("#hero-img-grow", {
            transform: `scale(${scale > 1 ? 1 : scale})`,
          });
        },
      });
    });

    return (
      <div id="hero-container-grow" class="h-[200vh] bg-base-100">
        <Image id="hero-img-grow"
          class="sticky top-0 h-[100vh] w-full scale-[0.1] object-contain object-center"
          alt={props.imgAlt}
        />
        <h2 class="invert-1 sticky bottom-[0vh] top-[50vh] ml-8 text-8xl font-black uppercase tracking-widest text-neutral-100 mix-blend-difference">
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
