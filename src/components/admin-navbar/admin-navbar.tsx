import { component$, useContext, $ } from "@builder.io/qwik";
import { UserContext } from "../AuthContext/AuthContext";
import { supabase } from "~/lib/supabse";

export const AdminNavbar = component$(() => {
  const user = useContext(UserContext);

  const handleSignOut = $(() => {
    supabase.auth.signOut();
  });

  return (
    <div class="navbar bg-base-100 fixed top-0 shadow-lg z-50">
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
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a href="#">Photos</a>
            </li>
            <li>
              <a href="#">Vidéos</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
          </ul>
        </div>
        <a href="/" class="btn btn-ghost text-xl">
          Portfolio
        </a>
      </div>
      <div class="navbar-center hidden lg:flex">
        {user.value && (
          <ul class="menu menu-horizontal px-1">
            <li>
              <a href="#">Photos</a>
            </li>
            <li>
              <a href="#">Vidéos</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
          </ul>
        )}
      </div>
      <div class="navbar-end">
        {user.value && (
          <button
            type="button"
            class="btn btn-outline btn-error"
            onClick$={handleSignOut}
          >
            Se déconnecter
          </button>
        )}
      </div>
    </div>
  );
});
