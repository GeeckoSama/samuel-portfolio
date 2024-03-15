import { component$ } from "@builder.io/qwik";
import Image from "@images/ID.jpg?jsx";
import { HiPaperAirplaneSolid } from "@qwikest/icons/heroicons";

export const ContactSection = component$(() => {
  return (
    <div class="card card-compact mx-auto my-[10vh] max-w-3xl rounded-none bg-base-100 lg:card-side lg:shadow-xl">
      <figure class="mx-auto max-w-xs">
        <Image class="h-auto w-full" />
      </figure>
      <div class="card-body space-y-20">
        <h2 class="text-center text-2xl font-bold leading-relaxed">
          Envie de me parler d'un projet ?
        </h2>
        <div class="card-actions justify-center">
          <a
            href="mailto:samfreret@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-outline btn-primary"
          >
            <HiPaperAirplaneSolid />
            Envoyer moi un email
          </a>
        </div>
      </div>
    </div>
  );
});
