import { component$, $ } from "@builder.io/qwik";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";
import type { SubmitHandler, InitialValues } from "@modular-forms/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import type { Input } from "valibot";
import { email, minLength, object, string } from "valibot";
import { TextInput } from "~/components/ui/text-input";
import { supabaseClient } from "~/lib/supabase";

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

type LoginForm = Input<typeof LoginSchema>;

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
  email: "",
  password: "",
}));

export default component$(() => {
  const nav = useNavigate();
  const [loginForm, { Form, Field }] = useForm<LoginForm>({
    loader: useFormLoader(),
    validate: valiForm$(LoginSchema),
  });

  const handleSubmit = $<SubmitHandler<LoginForm>>((values) => {
    // Runs on client
    console.log("values", values);
    supabaseClient()
      .auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      .then(() => {
        nav("/admin");
      })
      .catch((error) => {
        console.error("Error signing in", error);
      });
  });

  const handleReset = $(() => {
    nav("/");
  });

  return (
    <div class="flex h-screen content-center items-center">
      <div class="card mx-auto max-w-xl grow bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">Se connecter</h2>
          <Form onSubmit$={handleSubmit} class="flex flex-col gap-4">
            <Field name="email">
              {(field, props) => (
                <>
                  <TextInput
                    {...props}
                    {...field}
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={field.value}
                    required
                  />
                </>
              )}
            </Field>
            <Field name="password">
              {(field, props) => (
                <TextInput
                  {...props}
                  {...field}
                  label="Mot de passe"
                  type="password"
                  autoComplete="current-password"
                  value={field.value}
                  required
                />
              )}
            </Field>

            <div class="card-actions justify-end">
              <button
                type="submit"
                class="btn btn-primary"
                disabled={loginForm.invalid || loginForm.submitting}
              >
                {loginForm.submitting && (
                  <span class="loading loading-spinner"></span>
                )}
                Connexion
              </button>
              <button type="reset" onClick$={handleReset} class="btn btn-ghost">
                Annuler
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
});
