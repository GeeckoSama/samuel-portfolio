import type { NoSerialize, QRL } from "@builder.io/qwik";
import { $, component$ } from "@builder.io/qwik";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";
import type { SubmitHandler } from "@modular-forms/qwik";
import { useForm, valiForm$, type InitialValues } from "@modular-forms/qwik";
import type { Input } from "valibot";
import { minLength, number, object, optional, special, string } from "valibot";
import { FileInput } from "~/components/ui/file-input";
import { TextInput } from "~/components/ui/text-input";
import { supabaseClient, supabaseServer } from "~/lib/supabase";

const isFile = (input: unknown) => input instanceof File;

export const PhotoEditSchema = object({
  id: number(),
  title: string([minLength(1, "Le titre est requis")]),
  description: string([minLength(1, "La description est requise")]),
  photo_url: string(),
  file: object({
    item: optional(special<NoSerialize<File>>(isFile)),
  }),
});

export type PhotoEditForm = Input<typeof PhotoEditSchema>;

export const useFormLoader = routeLoader$(async (requestEvent) => {
  const supabaseClient = supabaseServer(requestEvent);
  const id = +requestEvent.params.id;
  if (!id) {
    throw new Error("id is required");
  }
  const { data, error } = await supabaseClient
    .from("photos")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  return {
    id: id,
    title: data.title,
    description: data.description,
    photo_url: data.url,
    file: {
      item: undefined,
    },
  } as InitialValues<PhotoEditForm>;
});

export default component$(() => {
  const nav = useNavigate();

  const [photoEditForm, { Form, Field }] = useForm<PhotoEditForm>({
    loader: useFormLoader(),
    validate: valiForm$(PhotoEditSchema),
  });

  const handleSubmit: QRL<SubmitHandler<PhotoEditForm>> = $(async (values) => {
    try {
      const supabase = supabaseClient();
      console.log("Start creating photo");
      console.log("values", values);
      const file = values.file.item;
      let photo_url = values.photo_url;
      if (file !== undefined) {
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
        photo_url = urlFile.data.publicUrl;
      }

      const { error } = await supabase
        .from("photos")
        .update({
          title: values.title,
          description: values.description,
          url: photo_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", values.id);

      if (error) {
        throw error;
      }
      console.log("Photo updated with success");
      //nav("/admin/photos");
    } catch (error) {
      console.error("Error uploading file", error);
    }
  });

  const handleReset = $(() => {
    nav("/admin/photos");
  });

  return (
    <div class="card mx-auto max-w-xl bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title">Créer une photo</h2>
        <Form onSubmit$={handleSubmit} class="flex flex-col gap-2">
          <Field name="id" type="number">
            {(field) => <input type="hidden" {...field} />}
          </Field>
          <Field name="title">
            {(field, props) => (
              <TextInput
                class="input input-bordered w-full"
                {...props}
                type="text"
                value={field.value}
                required
              />
            )}
          </Field>
          <Field name="description">
            {(field, props) => (
              <textarea
                class="textarea textarea-bordered w-full"
                {...props}
                value={field.value}
                required
              ></textarea>
            )}
          </Field>
          <Field name="photo_url">
            {(field) => (
              <>
                <img
                  src={field.value}
                  class="mx-auto rounded bg-base-300 shadow"
                  width={250}
                  height={250}
                />
                {field.error && <p class="text-red-400">{field.error}</p>}
              </>
            )}
          </Field>
          <Field name="file.item" type="File">
            {(field, props) => (
              <FileInput {...props} value={field.value} accept="image/*" />
            )}
          </Field>
          <div class="inline-flex justify-end gap-4">
            <button type="submit" class="btn btn-primary">
              {photoEditForm.submitting && (
                <span class="loading loading-spinner"></span>
              )}
              Enregistrer
            </button>
            <button
              type="reset"
              onClick$={handleReset}
              class="btn btn-outline btn-error"
            >
              Annuler
            </button>
          </div>
          {photoEditForm.invalid && (
            <p class="text-red-400">{photoEditForm.response.message}</p>
          )}
        </Form>
      </div>
    </div>
  );
});
