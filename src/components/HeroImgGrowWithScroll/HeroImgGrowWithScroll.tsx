import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlyphText } from "../ui/GlyphText";

export interface HeroImgGrowWithScrollProps {
  imgUrl: string;
  imgAlt: string;
  imgHeight: number;
  imgWidth: number;
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
        trigger: "#hero-img-grow",
        start: "top top",
        end: "bottom 50%+=1080px",
        scrub: true,
        onUpdate: (self) => {
          const scale = (Math.floor(self.progress * 100) + 10) / 100;
          gsap.to("img", {
            transform: `scale(${scale > 1 ? 1 : scale})`,
          });
        },
      });
    });

    return (
      <div id="hero-img-grow" class="h-[200vh] bg-base-100">
        <img
          class="sticky top-0 h-[100vh] w-full scale-[0.1] object-cover object-center"
          src={props.imgUrl}
          alt={props.imgAlt}
          height={props.imgHeight}
          width={props.imgWidth}
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
