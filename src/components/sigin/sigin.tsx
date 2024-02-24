import { component$, useSignal, $ } from "@builder.io/qwik";
import { email, minLength, object, parse, string } from "valibot";
import { supabase } from "~/lib/supabse";

const LoginSchema = object({
  email: string([
    minLength(1, "Please enter your email."),
    email("The email address is badly formatted."),
  ]),
  password: string([
    minLength(1, "Please enter your password."),
    minLength(6, "Your password must have 8 characters or more."),
  ]),
});

export const Sigin = component$(() => {
  const email = useSignal("");
  const password = useSignal("");

  const handleSubmit = $(async (event: any) => {
    console.log("Submitting form");
    try {
      event.preventDefault();
      const values = parse(LoginSchema, {
        email: email.value,
        password: password.value,
      });

      const response = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (response.error) {
        throw new Error(response.error.message);
      }
      console.log("User is logged in");
    } catch (error) {
      console.error("Error signing in", error);
    }
  });
  return (
    <div class="mx-auto max-w-2xl rounded-md bg-gray-50 p-4 shadow-md dark:bg-gray-800">
      <h1 class="mb-8 text-center text-3xl font-bold">Se connecter</h1>
      <form class="flex flex-col gap-4">
        <div>
          <label for="email" class="text-lg font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            class="w-full rounded-md border border-gray-300 p-2"
            bind:value={email}
          />
        </div>
        <div>
          <label for="password" class="text-lg font-semibold">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            class="w-full rounded-md border border-gray-300 p-2"
            bind:value={password}
          />
        </div>
        <button
          type="button"
          class="rounded-md bg-gray-700 p-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-700"
          disabled={email.value === "" || password.value === ""}
          onClick$={handleSubmit}
        >
          Login
        </button>
      </form>
    </div>
  );
});
