import { component$, Slot, useContext, useStyles$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";

import { AdminNavbar } from "~/components/admin-navbar/admin-navbar";
import { UserContext } from "~/components/auth-context/auth-context";
import { Sigin } from "~/components/sigin/sigin";
import styles from "./styles.css?inline";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  useStyles$(styles);
  const user = useContext(UserContext);
  return (
    <>
      <AdminNavbar />
      <main class="mt-14 min-h-screen bg-gray-200 py-4 dark:bg-gray-950">
        {user.value ? <Slot /> : <Sigin />}
      </main>
    </>
  );
});
