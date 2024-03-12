import { component$ } from "@builder.io/qwik";
import Image from "../../media/logo.png?jsx";
import { Link } from "@builder.io/qwik-city";

export const Navbar = component$(() => {
  return (
    <div class="navbar fixed top-0 z-50 bg-base-100 shadow lg:bg-transparent lg:mix-blend-difference">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabIndex={0} role="button" class="lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-base-300 invert-0"
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
              <Link href="#">Photos</Link>
            </li>
            <li>
              <Link href="#">Vidéos</Link>
            </li>
            <li>
              <Link href="#">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
      <div class="navbar-center">
        <Link href="/" class="btn btn-ghost text-xl">
          <Image class="h-12 w-auto" alt="logo" />
        </Link>
      </div>
      <div class="navbar-end"></div>
    </div>
  );
});
