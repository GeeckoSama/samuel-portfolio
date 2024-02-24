import { component$, useContext, $ } from "@builder.io/qwik";
import { UserContext } from "../AuthContext/AuthContext";
import { supabase } from "~/lib/supabse";

export const AdminNavbar = component$(() => {
  const user = useContext(UserContext);

  const handleSignOut = $(() => {
    supabase.auth.signOut();
  });

  return (
    <div class="fixed top-0 flex w-full flex-1 justify-between rounded-b-md bg-gray-50 p-4 text-gray-900 shadow-lg dark:bg-gray-800 dark:text-gray-100">
      <div>
        <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Administration
        </h1>
      </div>
      <div>
        {user.value && (
          <>
            <button
              onClick$={handleSignOut}
              class="rounded-md border-2 border-red-400 px-2 py-1.5 font-semibold transition-all hover:bg-red-400 hover:text-gray-50"
            >
              Se déconnecter
            </button>
          </>
        )}
      </div>
    </div>
  );
});
