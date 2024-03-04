import { Slot, component$, useSignal, $ } from "@builder.io/qwik";
import gsap from "gsap";

interface MagneticButtonProps {
  url: string;
}

export const MagneticButton = component$<MagneticButtonProps>((props) => {
  const magnetic = useSignal<HTMLElement>();

  const move = $((x: number, y: number) => {
    const xTo = gsap.quickTo(magnetic.value!, "x", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });
    const yTo = gsap.quickTo(magnetic.value!, "y", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });

    xTo(x);
    yTo(y);
  });

  const handleMouseLeave = $(() => {
    gsap.to(magnetic.value!, { x: 0, duration: 1 });
    gsap.to(magnetic.value!, { y: 0, duration: 1 });
    move(0, 0);
  });

  const handleMouseMove = $((event: MouseEvent) => {
    const { clientX, clientY } = event;
    const { height, width, left, top } =
      magnetic.value!.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    move(x, y);
  });

  return (
    <a
      href={props.url}
      ref={magnetic}
      onMouseLeave$={handleMouseLeave}
      onMouseMove$={handleMouseMove}
    >
      <Slot />
    </a>
  );
});
