import { $, component$, useTask$ } from "@builder.io/qwik";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";
import { TextInput } from "@components/ui/text-input";
import type { InitialValues, SubmitHandler } from "@modular-forms/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { SiGoogle } from "@qwikest/icons/simpleicons";
import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import type { Input } from "valibot";
import { email, minLength, object, string } from "valibot";
import { auth } from "~/libs/firebase";

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

  useTask$(() => {
    if (!auth) return;
    getRedirectResult(auth).then((result) => {
      if (result) {
        console.log("User signed in with redirect");
        nav("/admin");
      }
    });
  });

  const handleSubmit = $<SubmitHandler<LoginForm>>((values) => {
    // Runs on client
    if (!auth) return;
    console.log("values", values);
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        console.log("User signed in");
        nav("/admin");
      })
      .catch((error) => {
        console.error("Error signing in", error);
      });
  });

  const handleSigninWithGoogle = $(() => {
    console.log("Signin with Google");
    if (!auth) return;
    if (window.innerWidth < 768) {
      signInWithRedirect(auth, new GoogleAuthProvider());
    } else {
      signInWithPopup(auth, new GoogleAuthProvider()).then(() => nav("/admin"));
    }
  });

  const handleReset = $(() => {
    nav("/");
  });

  return (
    <div class="flex h-screen content-center items-center">
      <div class="card mx-auto max-w-xl grow bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">Se connecter</h2>
          <div class="flex justify-center">
            <button class="btn btn-ghost" onClick$={handleSigninWithGoogle}>
              <SiGoogle class="h-6 w-6" />
            </button>
          </div>
          <div class="divider">Ou</div>
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
