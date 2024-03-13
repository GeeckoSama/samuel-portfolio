import type { NoSerialize, QRL } from "@builder.io/qwik";
import { $, component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { SubmitHandler } from "@modular-forms/qwik";
import {
  formAction$,
  useForm,
  valiForm$,
  type InitialValues,
} from "@modular-forms/qwik";
import type { Input } from "valibot";
import { minLength, object, special, string } from "valibot";
import { FileInput } from "@components/ui/file-input";
import { TextInput } from "@components/ui/text-input";
import { supabaseClient, supabaseServer } from "@libs/supabase";

const isFile = (input: unknown) => input instanceof File;

export const PhotoSchema = object({
  title: string([minLength(1, "Le titre est requis")]),
  description: string([minLength(1, "La description est requise")]),
  file: object({
    item: special<NoSerialize<File>>(isFile),
  }),
});

export type PhotoForm = Input<typeof PhotoSchema>;

export const useFormLoader = routeLoader$<InitialValues<PhotoForm>>(() => ({
  title: "",
  description: "",
  file: {
    item: undefined,
  },
}));

export const useFormAction = formAction$<PhotoForm>(
  async (values, requestEvent) => {
    try {
      console.log("Start creating photo");
      const supabaseClient = supabaseServer(requestEvent);

      const file = values.file.item;
      if (!file) {
        throw new Error("No file");
      }

      const uploadedFile = await supabaseClient.storage
        .from("medias")
        .upload("photos/" + file.name + "." + file.type, file!);
      if (uploadedFile.error) {
        throw uploadedFile.error;
      }
      const urlFile = await supabaseClient.storage
        .from("medias")
        .createSignedUrl(uploadedFile.data.path, 60);
      if (urlFile.error) {
        throw urlFile.error;
      }

      const result = await supabaseClient.from("photos").insert([
        {
          title: values.title,
          description: values.description,
          photo_url: urlFile.data.signedUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      if (result.error) {
        throw result.error;
      }
      console.log("Photo created", result.status);
      requestEvent.redirect(300, "/admin/photos");
    } catch (error) {
      console.error("Error uploading file", error);
    }
  },
  valiForm$(PhotoSchema),
);

export default component$(() => {
  const [photoForm, { Form, Field }] = useForm<PhotoForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(PhotoSchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit: QRL<SubmitHandler<PhotoForm>> = $(async (values) => {
    try {
      const supabase = supabaseClient();
      console.log("Start creating photo");
      console.log("values", values);
      const file = values.file.item;
      if (!file) {
        throw new Error("No file");
      }

      const uploadedFile = await supabase.storage
        .from("medias")
        .upload("photos/" + file.name, file!);
      console.log("uploadedFile", uploadedFile);
      if (uploadedFile.error) {
        throw uploadedFile.error;
      }
      const urlFile = await supabase.storage
        .from("medias")
        .getPublicUrl(uploadedFile.data.path, { download: values.title });
      console.log("urlFile", urlFile);

      const result = await supabase.from("photos").insert([
        {
          title: values.title,
          description: values.description,
          url: urlFile.data.publicUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      console.log("result", result);
      if (result.error) {
        throw result.error;
      }
      console.log("Photo created", result.status);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  });

  return (
    <div class="card mx-auto max-w-xl bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title">Créer une photo</h2>
        <Form onSubmit$={handleSubmit} class="flex flex-col gap-2">
          <Field name="title">
            {(field, props) => (
              <TextInput
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
              <FileInput {...props} value={field.value} accept="image/*" />
            )}
          </Field>
          <button type="submit" class="btn btn-primary">
            {photoForm.submitting && (
              <span class="loading loading-spinner"></span>
            )}
            submit
          </button>
        </Form>
      </div>
    </div>
  );
});
