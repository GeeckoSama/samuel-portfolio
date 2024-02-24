import type { Signal } from "@builder.io/qwik";
import {
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { User } from "supabase-auth-helpers-qwik";
import { supabase } from "~/lib/supabse";

export const UserContext =
  createContextId<Signal<User | null>>("auth.user-context");

export const AuthContext = component$(() => {
  const user = useSignal<User | null>(null);
  useContextProvider(UserContext, user);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    supabase.auth.getSession().then((result) => {
      user.value = result.data.session?.user ?? null;
    });

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change", event, session);
      user.value = session?.user ?? null;
    });

    return () => {
      console.log("Unsubscribing from auth listener");
      authListener.unsubscribe();
    };
  });
  return (
    <>
      <Slot />
    </>
  );
});
