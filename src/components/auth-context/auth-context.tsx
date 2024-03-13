import type { Signal } from "@builder.io/qwik";
import {
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import type { User } from "supabase-auth-helpers-qwik";
import { supabaseClient } from "@libs/supabase";

export const UserContext =
  createContextId<Signal<User | null>>("auth.user-context");

export const AuthContext = component$(() => {
  const user = useSignal<User | null>(null);
  useContextProvider(UserContext, user);

  // eslint-disable-next-line qwik/no-use-visible-task
  useTask$(() => {
    if (isServer) return;
    const supabase = supabaseClient();
    supabase.auth.getSession().then((result) => {
      user.value = result.data.session?.user ?? null;
    });

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event, session) => {
      //console.log("Auth state change", event, session);
      user.value = session?.user ?? null;
    });

    return () => {
      //console.log("Unsubscribing from auth listener");
      authListener.unsubscribe();
    };
  });
  return (
    <>
      <Slot />
    </>
  );
});
