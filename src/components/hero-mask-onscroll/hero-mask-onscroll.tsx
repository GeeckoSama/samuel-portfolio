import {
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const HeroMaskOnscroll = component$(() => {
  const container = useSignal<HTMLDivElement>();
  const stickyMask = useSignal<HTMLDivElement>();

  useStylesScoped$(`
  .stickyMask {
    mask-image: url('/medias/colgate&holdup.svg');
    mask-position: center center;
    mask-repeat: no-repeat;
    mask-size: 50%;
  }
  `);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    console.log("container", container.value);
    gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);
      gsap
        .timeline({
          scrollTrigger: {
            trigger: container.value,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        })
        .fromTo(
          stickyMask.value!,
          {
            maskSize: "80%",
            maskPosition: "50% 50%",
          },
          {
            maskSize: "5000%",
            maskPosition: "62.5% 48%",
          },
        );
    });
  });

  return (
    <main class="mb-[100vh]">
      <div ref={container} class="relative h-[300vh] bg-base-100">
        <div
          ref={stickyMask}
          class="stickyMask sticky top-0 flex h-screen items-center justify-center overflow-hidden"
        >
          <video autoplay muted loop class="h-full w-full object-cover">
            <source src="/medias/COLGATE & HOLD UP.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </main>
  );
});
