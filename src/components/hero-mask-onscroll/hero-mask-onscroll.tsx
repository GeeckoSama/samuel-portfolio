import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Video } from "~/libs/video.type";

export const HeroMaskOnscroll = component$<{ video: Video }>((props) => {
  const cdn = import.meta.env.PUBLIC_IMGIX_URL;
  const container = useSignal<HTMLDivElement>();
  const stickyMask = useSignal<HTMLDivElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const context = gsap.context(() => {
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
    return () => {
      context.dispose();
    };
  });

  return (
    <section>
      <div ref={container} class="relative h-[300vh] bg-base-100">
        <div
          ref={stickyMask}
          style={{
            maskImage: `url('${cdn + props.video.svg_path}')`,
            maskPosition: "center center",
            maskRepeat: "no-repeat",
            maskSize: "50%",
          }}
          class="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
        >
          <video autoplay muted loop class="h-full w-full object-cover">
            <source src={props.video.path} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
});
