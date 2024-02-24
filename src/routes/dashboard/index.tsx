import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { createServerClient, type User } from "supabase-auth-helpers-qwik";

export const useUser = routeLoader$(async (requestEvent) => {
  const supabaseClient = createServerClient(
    requestEvent.env.get("PUBLIC_SUPABASE_URL")!,
    requestEvent.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
    requestEvent,
  );

  const { data, error } = await supabaseClient.auth.getSession();
  console.log(data);
  if (data.session?.user) {
    return data.session.user as User;
  }
  requestEvent.redirect(300, "/signin");
});

export default component$(() => {
  const user = useUser();
  return <div>New route works.{user.value?.email}</div>;
});
