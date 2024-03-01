import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { GlyphText } from "../ui/GlyphText";
import Image from "../../media/logo.png?jsx";

export const Navbar = component$(() => {
  return (
    <div class="bg-base-transparent navbar fixed top-0 z-50 mix-blend-difference">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabIndex={0} role="button" class="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <a href="#">Photos</a>
            </li>
            <li>
              <a href="#">Vidéos</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
        <a href="#" class="btn btn-ghost text-xl">
          <Image class="h-12 w-auto mix-blend-difference" alt="logo" />
        </a>
      </div>
      <div class="navbar-end hidden lg:flex">
        <ul class="menu menu-horizontal menu-lg px-1 ">
          <li>
            <Link href="#">
              <GlyphText text="Photos" />
            </Link>
          </li>
          <li>
            <Link href="#">
              <GlyphText text="Vidéos" />
            </Link>
          </li>
          <li>
            <Link href="#">
              <GlyphText text="Contact" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
});
