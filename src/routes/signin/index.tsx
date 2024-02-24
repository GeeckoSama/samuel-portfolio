import type { QRL } from "@builder.io/qwik";
import { $, component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues, SubmitHandler } from "@modular-forms/qwik";
import { useForm, valiForm$ } from "@modular-forms/qwik";
import { email, minLength, object, string, type Input } from "valibot";
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

type LoginForm = Input<typeof LoginSchema>;

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
  email: "",
  password: "",
}));

export default component$(() => {
  const [loginForm, { Form, Field }] = useForm<LoginForm>({
    loader: useFormLoader(),
    validate: valiForm$(LoginSchema),
  });

  const handleSubmit: QRL<SubmitHandler<LoginForm>> = $(async (values) => {
    if (loginForm.invalid) {
      console.log("Form is invalid");
      return;
    }
    console.log(values);
    const response = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (response.error) {
      console.log(response.error);
    }
    if (response.data.session !== null) {
      console.log("User is logged in");
    }
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
          class="rounded-md bg-gray-700 p-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-700"
          disabled={loginForm.invalid || !loginForm.dirty}
        >
          Login
        </button>
      </Form>
    </div>
  );
});
