import { component$, useSignal, $ } from "@builder.io/qwik";
import { email, minLength, object, parse, string } from "valibot";
import { supabase } from "~/lib/supabase";

const LoginSchema = object({
  email: string([
    minLength(1, "Veuillez entrer votre adresse email."),
    email("Veuillez entrer une adresse email valide."),
  ]),
  password: string([
    minLength(1, "Veuillez entrer votre mot de passe."),
    minLength(6, "Votre mot de passe doit contenir au moins 6 caractères."),
  ]),
});

export const Sigin = component$(() => {
  const email = useSignal("");
  const password = useSignal("");
  const errorText = useSignal("");

  const handleSubmit = $(async (event: any) => {
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
    } catch (error: any) {
      console.error("Error signing in", error);
      errorText.value = error.message;
    }
  });
  return (
    <div class="card mx-auto max-w-xl bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">Se connecter</h2>
        <form class="flex flex-col gap-4">
          <label class="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="h-4 w-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="email"
              autoComplete={"email"}
              class="grow"
              placeholder="Email"
              bind:value={email}
            />
          </label>

          <label class="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="h-4 w-4 opacity-70"
            >
              <path
                fill-rule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              type="password"
              autoComplete={"current-password"}
              class="grow"
              placeholder="password"
              bind:value={password}
            />
          </label>
          <div class="card-actions justify-end">
            <p class="text-red-500">{errorText}</p>
            <button
              type="button"
              class="btn btn-primary"
              disabled={email.value === "" || password.value === ""}
              onClick$={handleSubmit}
            >
              Connexion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
