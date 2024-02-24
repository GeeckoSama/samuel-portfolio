import { component$, useContext } from "@builder.io/qwik";
import { UserContext } from "../AuthContext/AuthContext";

export interface NavbarProps {}

export const Navbar = component$<NavbarProps>((props) => {
  const user = useContext(UserContext);
  return (
    <nav class="fixed top-0 flex w-full flex-1 justify-between rounded-b-md bg-gray-50 p-4 text-gray-900 shadow-lg dark:bg-gray-800 dark:text-gray-100">
      <div>logo</div>
      <ul class="inline-flex gap-4 text-lg font-semibold">
        <li>
          <a href="">About</a>
        </li>
        <li>
          <a href="">Photos</a>
        </li>
        <li>
          <a href="">Vidéos</a>
        </li>
        <li>
          <a href="">Contact</a>
        </li>
        {user.value ? (
          <li>
            <a href="">Admin</a>
          </li>
        ) : null}
      </ul>
    </nav>
  );
});
