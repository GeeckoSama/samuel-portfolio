import { component$ } from "@builder.io/qwik";

export const Navbar = component$(() => {
  return (
    <div class="navbar fixed top-0 bg-transparent">
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
              <a href="#">About</a>
            </li>
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
          Samuel Freret
        </a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li>
            <a href="#">About</a>
          </li>
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
      <div class="navbar-end"></div>
    </div>
  );
});
