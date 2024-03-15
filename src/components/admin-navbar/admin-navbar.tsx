import { component$, useContext, $ } from "@builder.io/qwik";
import { UserContext } from "../auth-context/auth-context";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { signOut } from "firebase/auth";
import { auth } from "@libs/firebase";

export const AdminNavbar = component$(() => {
  const user = useContext(UserContext);
  const nav = useNavigate();

  const handleSignOut = $(() => {
    signOut(auth).then(() => {
      nav("/sigin");
    });
  });

  return (
    <div class="navbar fixed top-0 z-50 bg-base-100 shadow-lg">
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
              <Link href="/photos">Photos</Link>
            </li>
            <li>
              <Link href="/videos">Vidéos</Link>
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
        {user.uid && (
          <ul class="menu menu-horizontal px-1">
            <li>
              <Link href="/admin/photos">Photos</Link>
            </li>
            <li>
              <Link href="/admin/videos">Vidéos</Link>
            </li>
            <li>
              <a href="#">About</a>
            </li>
          </ul>
        )}
      </div>
      <div class="navbar-end">
        {user.uid && (
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
