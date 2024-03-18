import type { QRL } from "@builder.io/qwik";
import { $, component$, useSignal } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { TextInput } from "@components/ui/text-input";
import { firestore } from "@libs/firebase";
import type { Photo } from "@libs/photo.type";
import type { SubmitHandler } from "@modular-forms/qwik";
import {
  insert,
  remove,
  useForm,
  valiForm$,
  type InitialValues,
} from "@modular-forms/qwik";
import { HiArrowLeftSolid, HiTrashSolid } from "@qwikest/icons/heroicons";
import { Image } from "@unpic/qwik";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import type { Input } from "valibot";
import { array, minLength, object, string } from "valibot";
import { Select } from "~/components/ui/select";

export const AlbumSchema = object({
  id: string(),
  title: string([minLength(1, "Le titre est requis")]),
  description: string([minLength(1, "La description est requise")]),
  localisations: array(string([minLength(1, "La localisation est requis")]), [
    minLength(1, "Au moins une localisation"),
  ]),
  covers: array(string([minLength(1, "La couverture est requise")]), [
    minLength(1, "Au moins une couverture"),
  ]),
});

export type AlbumForm = Input<typeof AlbumSchema>;

export const useFormLoader = routeLoader$<InitialValues<AlbumForm>>(
  async (requestEvent) => {
    const docRef = doc(firestore, "albums", requestEvent.params.albumId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        title: data.title,
        description: data.description,
        localisations: data.localisations,
        covers: data.covers ?? [],
      };
    }
    return {
      id: "",
      title: "",
      description: "",
      localisations: [],
      covers: [],
    };
  },
);

export const usePhotos = routeLoader$(async (requestEvent) => {
  const photosRef = collection(
    firestore,
    `albums/${requestEvent.params.albumId}/photos`,
  );
  return await getDocs(photosRef).then((snapshot) =>
    snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as Photo;
    }),
  );
});

export default component$(() => {
  const loading = useSignal(false);
  const photos = usePhotos();
  const [albumForm, { Form, Field, FieldArray }] = useForm<AlbumForm>({
    loader: useFormLoader(),
    fieldArrays: ["localisations", "covers"],
    validate: valiForm$(AlbumSchema),
  });

  const handleSubmit: QRL<SubmitHandler<AlbumForm>> = $(async (values) => {
    loading.value = true;
    try {
      console.log("Start updating album ", values.id);
      console.log("values", values);
      const albumsRef = doc(firestore, `albums/${values.id}`);
      await updateDoc(albumsRef, {
        title: values.title,
        description: values.description,
        localisations: values.localisations,
        covers: values.covers,
        update_at: Date.now(),
      });
      console.log("Album updated");
    } catch (error) {
      console.error("Error updating album: ", error);
    }
    loading.value = false;
  });
  return (
    <div class="card mx-auto max-w-xl bg-base-100 shadow-md">
      <div class="card-body">
        <div class="space-x-2 flex">
          <Link class="btn btn-ghost" href="../">
            <HiArrowLeftSolid class="h-6 w-6" />
          </Link>
          <h2 class="card-title">Modification de l'Album</h2>
        </div>

        <Form onSubmit$={handleSubmit} class="flex flex-col gap-2">
          <Field name="id">
            {(field, props) => <input {...props} type="hidden" />}
          </Field>
          <Field name="title">
            {(field, props) => (
              <TextInput
                class="input input-bordered w-full"
                {...props}
                label="Titre"
                error={field.error}
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
                            error={field.error}
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

          <FieldArray name="covers">
            {(fieldArray) => (
              <div class="flex flex-col justify-end space-y-2">
                <label class="mb-4">Couvertures</label>
                {fieldArray.items.map((item, index) => (
                  <div key={item}>
                    <Field name={`${fieldArray.name}.${index}`}>
                      {(field, props) => (
                        <div class="flex flex-row gap-2">
                          {field.value && (
                            <Image
                              src={
                                import.meta.env.PUBLIC_IMGIX_URL +
                                photos.value.find((photo) => {
                                  return photo.id === field.value;
                                })?.path
                              }
                              layout="constrained"
                              width={56}
                              height={56}
                            />
                          )}
                          <Select
                            {...props}
                            value={field.value}
                            options={photos.value.map((photo) => ({
                              label: photo.title,
                              value: photo.id,
                            }))}
                            error={field.error}
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
                  Ajouter une couverture
                </button>
              </div>
            )}
          </FieldArray>

          <div class="flex justify-end space-x-4">
            <button
              type="submit"
              class="btn btn-primary"
              disabled={albumForm.invalid || loading.value}
            >
              {loading.value && <span class="loading loading-spinner"></span>}
              Enregistrer les modifications
            </button>
            <Link type="reset" class="btn btn-outline btn-error" href="../">
              Annuler
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
});
