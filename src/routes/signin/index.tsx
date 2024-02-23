import { $, component$, type QRL } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues, SubmitHandler } from "@modular-forms/qwik";
import { formAction$, useForm, valiForm$ } from "@modular-forms/qwik";
import { createServerClient } from "supabase-auth-helpers-qwik";
import { email, minLength, object, string, type Input } from "valibot";

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

type LoginForm = Input<typeof LoginSchema>;

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
  email: "",
  password: "",
}));

export const useFormAction = formAction$<LoginForm>(
  async (values, requestEv) => {
    const supabaseClient = createServerClient(
      requestEv.env.get("PUBLIC_SUPABASE_URL")!,
      requestEv.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
      requestEv,
    );
    const response = await supabaseClient.auth.signInWithPassword({
      email: values.email.toString(),
      password: values.password.toString(),
    });
    console.log(response);
    if (response.error) {
      requestEv.fail(400, response.error);
    }
    if (response.data.session !== null) {
      requestEv.cookie.set(
        "sb-access-token",
        response.data.session.access_token,
        {
          path: "/",
          secure: true,
          httpOnly: true,
          sameSite: "strict",
        },
      );
      requestEv.cookie.set(
        "sb-refresh-token",
        response.data.session.refresh_token,
        { path: "/", secure: true, httpOnly: true, sameSite: "strict" },
      );
    }

    requestEv.redirect(300, "/");
  },
  valiForm$(LoginSchema),
);

export default component$(() => {
  const [loginForm, { Form, Field }] = useForm<LoginForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(LoginSchema),
  });

  const handleSubmit: QRL<SubmitHandler<LoginForm>> = $((values, event) => {
    console.log(values);
  });

  return (
    <div class="mx-auto max-w-2xl rounded-md bg-gray-50 p-4 shadow-md dark:bg-gray-800">
      <h1 class="mb-8 text-center text-3xl font-bold">Se connecter</h1>
      <Form onSubmit$={handleSubmit} class="flex flex-col gap-4">
        <Field name="email">
          {(field, props) => (
            <div>
              <label for="email" class="text-lg font-semibold">
                Email
              </label>
              <input
                {...props}
                type="email"
                id="email"
                class="w-full rounded-md border border-gray-300 p-2"
                value={field.value}
              />
              {field.error && <div>{field.error}</div>}
            </div>
          )}
        </Field>
        <Field name="password">
          {(field, props) => (
            <div>
              <label for="password" class="text-lg font-semibold">
                Mot de passe
              </label>
              <input
                {...props}
                type="password"
                id="password"
                class="w-full rounded-md border border-gray-300 p-2"
                value={field.value}
              />
              {field.error && <div>{field.error}</div>}
            </div>
          )}
        </Field>
        <button
          type="submit"
          class="rounded-md bg-gray-700 p-2 font-semibold text-white"
        >
          Login
        </button>
      </Form>
    </div>
  );
});
