import {
  component$,
  Slot,
  useContext,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";

import { AdminNavbar } from "~/components/admin-navbar/admin-navbar";
import { UserContext } from "~/components/auth-context/auth-context";

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
  const user = useContext(UserContext);
  const nav = useNavigate();
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    setTimeout(() => {
      if (!user.uid) {
        nav("/sigin");
      }
    }, 1000);
  });
  return (
    <>
      <AdminNavbar />
      <main class="mt-14 min-h-screen bg-base-200 py-4">
        {user.uid ? <Slot /> : <></>}
      </main>
    </>
  );
});
