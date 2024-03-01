import {
  component$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from './HeroParallaxScroll.module.css'

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
              top: Math.floor(Math.random() * 75) + 25,
            },
            0,
          );
        });
      });
      return () => context.revert();
    });

    return (
      <div ref={containerRef} class={styles.container}>
        <div class={styles.body}>
          <h1 ref={titleRef}>
            {props.title}
          </h1>
          <div class={styles.word}>
            <p>
              {props.word.split("").map((letter, i) => {
                return (
                  <span
                    key={`l_${i}`}
                    ref={(el) => (lettersRefs.value[i] = el)}
                    class="relative"
                  >
                    {letter}
                  </span>
                );
              })}
            </p>
          </div>
        </div>

        <div class={styles.images}>
          {props.images.map((image, i) => {
            return (
              <div
                key={`i_${i}`}
                ref={(el) => (imagesRefs.value[i] = el)}
                class={styles.imageContainer}
              >
                <img src={image} alt="image" />
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
