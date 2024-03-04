import { component$ } from "@builder.io/qwik";
import { MagneticButton } from "../ui/magnetic-button";
import { Link } from "@builder.io/qwik-city";
import { GlyphText } from "../ui/glyph-text";
import { SiInstagram, SiYoutube } from "@qwikest/icons/simpleicons";

export const Footer = component$(() => {
  return (
    <footer class="footer footer-center rounded bg-base-100 p-10 text-base-content">
      <nav>
        <div class="grid grid-flow-col gap-12">
          <MagneticButton url="https://www.instagram.com/guiltyjacket_?igsh=eGVqdWRleGhwMWto&utm_source=qr">
            <SiInstagram class="h-8 w-8 fill-current" />
          </MagneticButton>
          <MagneticButton url="https://l.instagram.com/?u=https%3A%2F%2Fyoutube.com%2F%40guiltyvision%3Fsi%3DIkBKCQ8wDUD-7gbH&e=AT3oZMeKEy1uqzxLgPbe88ghDKGZ47ESMOdhhMFKG1EJ98Q_Fx3rXTjbMy_-tvWmZarswoSXM1zIDEmLiEES5X_9cHWVkCPtEdLGBoHUZWAQ7JhiFNEnDLhWYfMUQQ7UDCZLIYih75Z3Uvb7TXMHwfg">
            <SiYoutube class="h-8 w-8 fill-current" />
          </MagneticButton>
        </div>
      </nav>
      <aside>
        <div>
          Réalisé par{" "}
          <Link href="https://github.com/GeeckoSama">
            <GlyphText text="GeeckoSama" />
          </Link>
        </div>
      </aside>
    </footer>
  );
});
