import { component$, useStylesScoped$ } from "@builder.io/qwik";

export interface GlichedTextProps {
  text: string;
  speed?: number;
}

export const GlyphText = component$<GlichedTextProps>((props) => {
  useStylesScoped$(`
  div > span::after {
    content: attr(data-char);
  }
  
  div:is(:hover, :focus-visible) > span::after {
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
    "ラドクリフマラソンわたしワタシんょンョたばこタバコとうきょうトウキョウ";
  const randomChar = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

  return (
    <div
      class="relative uppercase"
      style={{ "--speed": props.speed || 0.25, "--intent": 1 }}
    >
      {props.text.split("").map((char, index) => {
        return (
          <span
            class="relative text-transparent after:absolute after:inset-0 after:text-neutral-100 after:mix-blend-difference after:invert-0"
            key={index}
            data-char={char}
            style={{
              "--index": index,
              "--char-1": `"${randomChar()}"`,
              "--char-2": `"${randomChar()}"`,
              "--char-3": `"${randomChar()}"`,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
});
