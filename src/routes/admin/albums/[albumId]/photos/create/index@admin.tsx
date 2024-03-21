import type { NoSerialize, QRL } from "@builder.io/qwik";
import { $, component$, useSignal } from "@builder.io/qwik";
import { Link, routeLoader$, useNavigate } from "@builder.io/qwik-city";
import { FileInput } from "@components/ui/file-input";
import { TextInput } from "@components/ui/text-input";
import type { SubmitHandler } from "@modular-forms/qwik";
import { useForm, valiForm$, type InitialValues } from "@modular-forms/qwik";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import type { Input } from "valibot";
import { minLength, object, special, string } from "valibot";
import { firestore, storage } from "@libs/firebase";
import { HiArrowLeftSolid } from "@qwikest/icons/heroicons";

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

export const useAlbumId = routeLoader$((requestEvent) => {
  return requestEvent.params.albumId;
});

export default component$(() => {
  const nav = useNavigate();
  const loading = useSignal(false);
  const albumId = useAlbumId();
  const [photoForm, { Form, Field }] = useForm<PhotoForm>({
    loader: useFormLoader(),
    validate: valiForm$(PhotoSchema),
  });

  const handleSubmit: QRL<SubmitHandler<PhotoForm>> = $(async (values) => {
    console.log(values);
    loading.value = true;
    try {
      if (!values.file.item)
        throw new Error("Aucun fichier n'a été sélectionné");
      const filePath = `albums/${albumId.value}/${values.file.item.name}`;
      const storageRef = ref(storage(), filePath);
      const uploadedFile = await uploadBytes(storageRef, values.file.item);
      console.log(uploadedFile);
      const imageRef = collection(
        firestore(),
        `albums/${albumId.value}/photos`,
      );
      const result = await addDoc(imageRef, {
        title: values.title,
        description: values.description,
        path: filePath,
        create_at: Date.now(),
        update_at: Date.now(),
      });
      console.log("Photo created with id :", result.id);
      loading.value = false;
      nav("../");
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div class="card mx-auto max-w-xl bg-base-100 shadow-md">
      <div class="card-body">
        <div class="flex space-x-2">
          <Link href="../" class="btn btn-ghost btn-sm">
            <HiArrowLeftSolid class="h-6 w-6" />
          </Link>
          <h2 class="card-title">Créer une photo</h2>
        </div>
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
          <div class="flex justify-end space-x-4">
            <button type="submit" class="btn btn-primary">
              {photoForm.submitting && (
                <span class="loading loading-spinner"></span>
              )}
              Créer la photo
            </button>
            <button
              type="reset"
              class="btn btn-outline btn-error"
              onClick$={() => nav("../")}
            >
              Annuler
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
});
