import { component$, useStylesScoped$ } from "@builder.io/qwik";

export interface HoverGlyphButtonProps {
  label: string;
  speed?: number;
}

export const HoverGlyphButton = component$<HoverGlyphButtonProps>((props) => {
  useStylesScoped$(`
  button::after {
    content: ""; 
    position: absolute;
    inset: 0;
    background: hsl(0 0% 100%);
    opacity: calc(var(--intent, 0) * 0.0875);
    transition: opacity 0.2s;
  }
  
  button:is(:hover, :focus-visible) {
    --intent: 1;
  }

  button > span:not(.sr-only) {
    position: relative;
    color: transparent;
  }
  
  button > span:not(.sr-only)::after {
    content: attr(data-char);
    position: absolute;
    display: inline-block;
    inset: 0;
    color: canvasText;
  }
  
  button:is(:hover, :focus-visible) > span:not(.sr-only)::after {
    animation: flash calc(var(--speed, 0.25) * 1s) calc(var(--index, 0) * 0.05s) steps(1, end);
  }
  
  @keyframes flash {
    0%, 20%   { content: '_'; }
    40%  { content: var(--char-1); }
    60%  { content: var(--char-2); }
    80%  { content: var(--char-3); }
  }
  `);

  const GLYPHS =
    "ラドクリフマラソンわたしワタシんょンョたばこタバコとうきょうトウキョウ0123456789±!@#$%^&*()_+ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return (
    <button
      class="relative cursor-pointer bg-transparent px-2 py-1 uppercase"
      style={{ "--speed": props.speed || 0.25 }}
    >
      {props.label.split("").map((char, index) => {
        return (
          <span
            key={index}
            data-char={char}
            style={{
              "--index": index,
              "--char-1": `"${
                GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
              }"`,
              "--char-2": `"${
                GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
              }"`,
              "--char-3": `"${
                GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
              }"`,
            }}
          >
            {char}
          </span>
        );
      })}
    </button>
  );
});
