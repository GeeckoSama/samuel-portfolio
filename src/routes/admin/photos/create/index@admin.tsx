import type { NoSerialize } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import {
  formAction$,
  valiForm$,
  type InitialValues,
  useForm,
} from "@modular-forms/qwik";
import type { Input } from "valibot";
import { array, minLength, object, optional, special, string } from "valibot";

const isFile = (input: unknown) => input instanceof File;

export const PhotoSchema = object({
  title: string([minLength(1, "Le titre est requis")]),
  description: string([minLength(1, "La description est requise")]),
  file: object({
    list: array(special<NoSerialize<File>>(isFile)),
    item: optional(special<NoSerialize<File>>(isFile)),
  }),
});

export type PhotoForm = Input<typeof PhotoSchema>;

export const useFormLoader = routeLoader$<InitialValues<PhotoForm>>(() => ({
  title: "",
  description: "",
  file: {
    list: [],
    item: undefined,
  },
}));

export const useFormAction = formAction$<PhotoForm>((values) => {
  console.log("values", values);
}, valiForm$(PhotoSchema));

export default component$(() => {
  const [photoForm, { Form, Field }] = useForm<PhotoForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(PhotoSchema),
  });
  return (
    <div class="card mx-auto max-w-xl bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title">Créer une photo</h2>
        <Form class="flex flex-col gap-2">
          <Field name="title">
            {(field, props) => (
              <input
                class="input input-bordered w-full"
                {...props}
                type="text"
                value={field.value}
              />
            )}
          </Field>
          <Field name="description">
            {(field, props) => (
              <textarea
                class="textarea textarea-bordered w-full"
                {...props}
                value={field.value}
              ></textarea>
            )}
          </Field>
          <Field name="file.item" type="File">
            {(field, props) => (
              <input
                class="file-input file-input-bordered w-full"
                multiple={false}
                accept="image/*"
                {...props}
                type="file"
                value={field.value}
              />
            )}
          </Field>
          <button type="submit" class="btn btn-primary">
            submit
          </button>
        </Form>
      </div>
    </div>
  );
});
