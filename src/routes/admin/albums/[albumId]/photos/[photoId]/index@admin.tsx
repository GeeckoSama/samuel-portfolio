import type { NoSerialize, QRL } from "@builder.io/qwik";
import { $, component$, useSignal } from "@builder.io/qwik";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";
import { FileInput } from "@components/ui/file-input";
import { TextInput } from "@components/ui/text-input";
import type { SubmitHandler } from "@modular-forms/qwik";
import { useForm, valiForm$, type InitialValues } from "@modular-forms/qwik";
import { Image } from "@unpic/qwik";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { Input } from "valibot";
import { minLength, object, optional, special, string } from "valibot";
import { firestore, storage } from "~/libs/firebase";
import { deleteObject, ref, uploadBytes } from "firebase/storage";

const isFile = (input: unknown) => input instanceof File;

export const PhotoEditSchema = object({
  id: string(),
  title: string([minLength(1, "Le titre est requis")]),
  description: string([minLength(1, "La description est requise")]),
  path: string(),
  file: object({
    item: optional(special<NoSerialize<File>>(isFile)),
  }),
});

export type PhotoEditForm = Input<typeof PhotoEditSchema>;

export const useFormLoader = routeLoader$(async (requestEvent) => {
  const albumId = requestEvent.params.albumId;
  const photoId = requestEvent.params.photoId;
  const docRef = doc(firestore, `albums/${albumId}/photos/${photoId}`);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      title: snapshot.data().title,
      description: snapshot.data().description,
      path: snapshot.data().path,
      file: {
        item: undefined,
      },
    } as InitialValues<PhotoEditForm>;
  }
  return {
    id: "",
    title: "",
    description: "",
    path: "",
    file: {
      item: undefined,
    },
  } as InitialValues<PhotoEditForm>;
});

export const useAlbumId = routeLoader$((requestEvent) => {
  return requestEvent.params.albumId;
});

export default component$(() => {
  const nav = useNavigate();
  const loading = useSignal(false);
  const albumId = useAlbumId();
  const [photoEditForm, { Form, Field }] = useForm<PhotoEditForm>({
    loader: useFormLoader(),
    validate: valiForm$(PhotoEditSchema),
  });

  const handleSubmit: QRL<SubmitHandler<PhotoEditForm>> = $(async (values) => {
    console.log(values);
    loading.value = true;
    try {
      if (values.file.item) {
        const filePath = `albums/${albumId.value}/${values.file.item.name}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, values.file.item);
        const deleteRef = ref(storage, values.path);
        await deleteObject(deleteRef);
        values.path = filePath;
      }

      const imageRef = doc(
        firestore,
        `albums/${albumId.value}/photos/${values.id}`,
      );
      await updateDoc(imageRef, {
        title: values.title,
        description: values.description,
        path: values.path,
        update_at: Date.now(),
      });
      console.log("Photo updated with id :", values.id);
      loading.value = false;
      nav("../");
    } catch (error) {
      console.error(error);
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
          <Field name="id" type="string">
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
          <Field name="path">
            {(field) => (
              <>
                <Image
                  src={import.meta.env.PUBLIC_IMGIX_URL + field.value}
                  class="mx-auto bg-base-300"
                  layout="constrained"
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
