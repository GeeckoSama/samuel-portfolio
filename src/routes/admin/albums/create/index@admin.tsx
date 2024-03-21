import type { QRL } from "@builder.io/qwik";
import { $, component$, useSignal } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { SubmitHandler } from "@modular-forms/qwik";
import {
  useForm,
  valiForm$,
  type InitialValues,
  insert,
  remove,
} from "@modular-forms/qwik";
import type { Input } from "valibot";
import { array, minLength, object, string } from "valibot";
import { TextInput } from "@components/ui/text-input";
import { HiTrashSolid } from "@qwikest/icons/heroicons";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "@libs/firebase";
import type { Album } from "@libs/photo.type";

export const AlbumSchema = object({
  title: string([minLength(1, "Le titre est requis")]),
  description: string([minLength(1, "La description est requise")]),
  localisations: array(string([minLength(1, "La localisation est requis")]), [
    minLength(1, "Au moins une localisation"),
  ]),
});

export type AlbumForm = Input<typeof AlbumSchema>;

export const useFormLoader = routeLoader$<InitialValues<AlbumForm>>(() => ({
  title: "",
  description: "",
  localisations: [],
}));

export default component$(() => {
  const loading = useSignal(false);
  const [albumForm, { Form, Field, FieldArray }] = useForm<AlbumForm>({
    loader: useFormLoader(),
    fieldArrays: ["localisations"],
    validate: valiForm$(AlbumSchema),
  });

  const handleSubmit: QRL<SubmitHandler<AlbumForm>> = $(async (values) => {
    loading.value = true;
    console.log("Start creating album");
    const albumsRef = collection(firestore(), "albums");
    addDoc(albumsRef, {
      ...values,
      create_at: Date.now(),
      update_at: Date.now(),
    } as Album)
      .then(() => {
        console.log("Album created");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      })
      .finally(() => {
        loading.value = false;
      });
  });
  return (
    <div class="card mx-auto max-w-xl bg-base-100 shadow-md">
      <div class="card-body">
        <h2 class="card-title">Création d'un Album</h2>
        <Form onSubmit$={handleSubmit} class="flex flex-col gap-2">
          <Field name="title">
            {(field, props) => (
              <TextInput
                class="input input-bordered w-full"
                {...props}
                label="Titre"
                required={true}
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
          <FieldArray name="localisations">
            {(fieldArray) => (
              <div class="flex flex-col justify-end space-y-2">
                <label class="mb-4">Localisations</label>
                {fieldArray.items.map((item, index) => (
                  <div key={item}>
                    <Field name={`${fieldArray.name}.${index}`}>
                      {(field, props) => (
                        <div class="flex flex-row gap-2">
                          <TextInput
                            class="input input-bordered w-full"
                            {...props}
                            type="text"
                            value={field.value}
                          />
                          <button
                            type="button"
                            class="btn btn-ghost "
                            onClick$={() =>
                              remove(albumForm, fieldArray.name, { at: index })
                            }
                          >
                            <HiTrashSolid class="h-6 w-6" />
                          </button>
                        </div>
                      )}
                    </Field>
                  </div>
                ))}
                <button
                  type="button"
                  class="btn btn-ghost"
                  onClick$={() =>
                    insert(albumForm, fieldArray.name, { value: "" })
                  }
                >
                  Ajouter une localisation
                </button>
              </div>
            )}
          </FieldArray>

          <button
            type="submit"
            class="btn btn-primary"
            disabled={albumForm.invalid || loading.value}
          >
            {loading.value && <span class="loading loading-spinner"></span>}
            Créer l'album
          </button>
        </Form>
      </div>
    </div>
  );
});
