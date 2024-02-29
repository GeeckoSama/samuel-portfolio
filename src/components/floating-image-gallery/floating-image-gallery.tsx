import { component$, useSignal, useStylesScoped$ } from "@builder.io/qwik";

/* function useMousePosition() {
  const position = useStore({ x: 0, y: 0 });
  useOnDocument(
    "mousemove",
    $((event) => {
      const { x, y } = event as MouseEvent;
      position.x = x;
      position.y = y;
    }),
  );
  return position;
} */

export const FloatingImageGallery = component$(() => {
  useStylesScoped$(`
    .main{
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      position: relative;
      .title{
          position: absolute;
          left: 50%;
          top: 45%;
          transform: translateX(-50%) translateY(-50%);
          font-size: 18px;
          h1{
              font-weight: 400;
              color: white;
              margin: 0px;
              text-align: center;
          }
          p{
              color: grey;
              margin: 0px;
              text-align: center;
              margin-top: 10px;
          }
      }
      .plane{
        width: 100%;
        height: 100%;
        position: absolute;
        img{
            position: absolute;
        }
    &:nth-of-type(1){
            filter: brightness(0.7);
            img{
                &:nth-of-type(1){
                    left:90%;
                    top: 70%;
                }
                &:nth-of-type(2){
                    left: 5%;
                    top: 65%;
                }
                &:nth-of-type(3){
                    left: 35%;
                    top: 0%;
                }
            }
        }
        &:nth-of-type(2){
            filter: brightness(0.6);
            img{
                &:nth-of-type(1){
                    left: 5%;
                    top: 10%;
                }
                &:nth-of-type(2){
                    left: 80%;
                    top: 5%;
                }
                &:nth-of-type(3){
                    left: 60%;
                    top: 60%;
                }
            }
        }
        &:nth-of-type(3){
            filter: brightness(0.5);
            img{
                &:nth-of-type(1){
                    left: 65%;
                    top: 2.5%;
                }
                &:nth-of-type(2){
                    left: 40%;
                    top: 75%;
                }
            }
        }
    }
  `);
  const floating =
    "https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg";

  const plane1 = useSignal<HTMLDivElement>();
  const plane2 = useSignal<HTMLDivElement>();
  const plane3 = useSignal<HTMLDivElement>();
  /* const force = useMousePosition();
    const requestAnimationFrameId = useSignal<number | null>(null);
    const easing = 0.08;
    const speed = 0.01;

    const lerp = (start: number, target: number, amount: number) =>
      start * (1 - amount) + target * amount;
    const animate = () => {
      force.x = lerp(force.x, 0, easing);
      force.y = lerp(force.y, 0, easing);
      gsap.set(plane1.value!, { x: `+=${force.x}`, y: `+=${force.y}` });
      gsap.set(plane2.value!, {
        x: `+=${force.x * 0.5}`,
        y: `+=${force.y * 0.5}`,
      });
      gsap.set(plane3!, {
        x: `+=${force.x * 0.25}`,
        y: `+=${force.y * 0.25}`,
      });

      if (Math.abs(force.x) < 0.01) force.x = 0;
      if (Math.abs(force.y) < 0.01) force.y = 0;

      if (force.x != 0 || force.y != 0) {
        requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(requestAnimationFrameId.value!);
        requestAnimationFrameId.value = null;
      }
    }; */

  return (
    <main class="main">
      <div ref={plane1} class="plane">
        <img src={floating} alt="img" width={300} height={500} />
        <img src={floating} alt="img" width={300} height={500} />
        <img src={floating} alt="img" width={225} height={500} />
      </div>
      <div ref={plane2} class="plane">
        <img src={floating} alt="img" width={250} height={500} />
        <img src={floating} alt="img" width={200} height={500} />
        <img src={floating} alt="img" width={225} height={500} />
      </div>
      <div ref={plane3} class="plane">
        <img src={floating} alt="img" width={150} height={500} />
        <img src={floating} alt="img" width={200} height={500} />
      </div>
      <div class="title">
        <h1>Floating imgs Gallery</h1>
        <p>Next.js and GSAP</p>
      </div>
    </main>
  );
});
