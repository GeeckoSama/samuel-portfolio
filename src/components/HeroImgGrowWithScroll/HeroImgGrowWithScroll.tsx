import { component$, useVisibleTask$ } from "@builder.io/qwik";
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
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: "#hero-img-grow",
        start: "top top",
        end: "bottom 50%+=1080px",
        onToggle: (self) => console.log("toggled, isActive:", self.isActive),
        onUpdate: (self) => {
          const scale = (Math.floor(self.progress * 100) + 10) / 100;
          console.log(scale > 1 ? 1 : scale);
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
        <h2 class="invert-1 sticky bottom-[0vh] top-[50vh] ml-8 text-8xl font-black text-neutral-100 mix-blend-difference uppercase tracking-widest">
          <GlyphText text={props.text} />
        </h2>
      </div>
    );
  },
);
