import type { NoSerialize, QRL } from "@builder.io/qwik";
import { $, component$, useSignal } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import type { InitialValues, SubmitHandler } from "@modular-forms/qwik";
import { insert, remove, useForm, valiForm$ } from "@modular-forms/qwik";
import { HiArrowLeftSolid, HiTrashSolid } from "@qwikest/icons/heroicons";
import { addDoc, collection } from "firebase/firestore";
import type { UploadResult } from "firebase/storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import type { Input } from "valibot";
import { array, minLength, object, optional, special, string } from "valibot";
import { FileInput } from "@components/ui/file-input";
import { TextAreaInput } from "@components/ui/text-area-input";
import { TextInput } from "@components/ui/text-input";
import { firestore, storage } from "@libs/firebase";

const isFile = (input: unknown) => input instanceof File;

export const VideoSchema = object({
  title: string([minLength(1, "Le titre est requis")]),
  description: string([minLength(1, "La description est requise")]),
  credits: array(string([minLength(1, "Le crédit est requis")]), [
    minLength(1, "Au moins un crédit"),
  ]),
  localisations: optional(
    array(string([minLength(1, "La localisation est requis")]), [
      minLength(1, "Au moins une localisation"),
    ]),
  ),
  production_date: string(),
  cover: object({
    item: special<NoSerialize<File>>(isFile),
  }),
  path: object({
    item: special<NoSerialize<File>>(isFile),
  }),
  svg_path: object({
    item: special<NoSerialize<File>>(isFile),
  }),
  youtube_url: string([minLength(1, "L'url youtube est requise")]),
});

export type VideoForm = Input<typeof VideoSchema>;

export const useFormLoader = routeLoader$<InitialValues<VideoForm>>(() => {
  return {
    title: "",
    description: "",
    credits: [],
    localisations: [],
    production_date: new Date(Date.now()).toISOString().split("T")[0],
    cover: { item: undefined },
    path: { item: undefined },
    svg_path: { item: undefined },
    youtube_url: "",
  };
});

export default component$(() => {
  const loading = useSignal(false);
  const [videoForm, { Form, Field, FieldArray }] = useForm<VideoForm>({
    loader: useFormLoader(),
    fieldArrays: ["credits", "localisations"],
    validate: valiForm$(VideoSchema),
  });

  const handleSubmit: QRL<SubmitHandler<VideoForm>> = $(async (values) => {
    console.log(values);
    loading.value = true;
    try {
      const uploads: Promise<UploadResult>[] = [];
      /* upload cover */
      if (!values.cover.item)
        throw new Error("Aucune couverture n'a été sélectionnée");
      const coverRef = ref(
        storage(),
        `videos/${values.title}/${values.cover.item.name}`,
      );
      uploads.push(uploadBytes(coverRef, values.cover.item));
      /* upload path */
      if (!values.path.item)
        throw new Error("Aucune vidéo n'a été sélectionnée");
      const pathRef = ref(
        storage(),
        `videos/${values.title}/${values.path.item.name}`,
      );
      uploads.push(uploadBytes(pathRef, values.path.item));
      /* upload svg */
      if (!values.svg_path.item)
        throw new Error("Aucun svg n'a été sélectionné");
      const svgRef = ref(
        storage(),
        `videos/${values.title}/${values.svg_path.item.name}`,
      );
      uploads.push(uploadBytes(svgRef, values.svg_path.item));

      const [cover, path, svg] = await Promise.all(uploads);
      const videoUrl = await getDownloadURL(path.ref);
      console.log(cover, path, svg);

      const videoRef = collection(firestore(), "videos");
      await addDoc(videoRef, {
        title: values.title,
        description: values.description,
        credits: values.credits,
        localisations: values.localisations,
        production_date: new Date(values.production_date).getTime(),
        cover: cover.ref.fullPath,
        path: videoUrl,
        svg_path: svg.ref.fullPath,
        youtube_url: values.youtube_url,
        create_at: Date.now(),
        update_at: Date.now(),
      });
      loading.value = false;
      console.log("Video created");
    } catch (error) {
      console.error(error);
      loading.value = false;
    }
  });

  return (
    <div class="card mx-auto max-w-xl bg-base-100 shadow-md">
      <div class="card-body">
        <div class="flex space-x-2">
          <Link href="../" class="btn btn-ghost btn-sm">
            <HiArrowLeftSolid class="h-6 w-6" />
          </Link>
          <h2 class="card-title">Création d'une vidéo</h2>
        </div>
        <Form onSubmit$={handleSubmit} class="flex flex-col gap-2">
          <Field name="title" type="string">
            {(field, props) => (
              <TextInput
                {...props}
                type="text"
                label="Titre"
                required={true}
                value={field.value}
                error={field.error}
              />
            )}
          </Field>

          <Field name="description" type="string">
            {(field, props) => (
              <TextAreaInput
                {...props}
                label="Description"
                required={true}
                value={field.value}
                error={field.error}
              />
            )}
          </Field>

          <FieldArray name="credits">
            {(fieldArray) => (
              <div>
                <label class="label">Crédits</label>
                <div class="flex flex-col gap-2">
                  {fieldArray.items.map((credit, index) => (
                    <Field key={index} name={`${fieldArray.name}.${index}`}>
                      {(field, props) => (
                        <div class="flex flex-row gap-2">
                          <TextInput
                            {...props}
                            type="text"
                            required={true}
                            value={field.value}
                            error={field.error}
                          />
                          <button
                            type="button"
                            class="btn btn-ghost"
                            onClick$={() =>
                              remove(videoForm, fieldArray.name, { at: index })
                            }
                          >
                            <HiTrashSolid class="h-6 w-6" />
                          </button>
                        </div>
                      )}
                    </Field>
                  ))}
                  <button
                    type="button"
                    class="btn btn-ghost"
                    onClick$={() =>
                      insert(videoForm, fieldArray.name, { value: "" })
                    }
                  >
                    Ajouter un crédit
                  </button>
                </div>
              </div>
            )}
          </FieldArray>

          <FieldArray name="localisations">
            {(fieldArray) => (
              <div>
                <label class="label">Localisations</label>
                <div class="flex flex-col gap-2">
                  {fieldArray.items.map((localisation, index) => (
                    <Field key={index} name={`${fieldArray.name}.${index}`}>
                      {(field, props) => (
                        <div class="flex flex-row gap-2">
                          <TextInput
                            {...props}
                            type="text"
                            required={true}
                            value={field.value}
                            error={field.error}
                          />
                          <button
                            type="button"
                            class="btn btn-ghost"
                            onClick$={() =>
                              remove(videoForm, fieldArray.name, { at: index })
                            }
                          >
                            <HiTrashSolid class="h-6 w-6" />
                          </button>
                        </div>
                      )}
                    </Field>
                  ))}
                  <button
                    type="button"
                    class="btn btn-ghost"
                    onClick$={() =>
                      insert(videoForm, fieldArray.name, { value: "" })
                    }
                  >
                    Ajouter une localisation
                  </button>
                </div>
              </div>
            )}
          </FieldArray>

          <Field name="production_date">
            {(field, props) => (
              <TextInput
                {...props}
                type="date"
                label="Date de production"
                value={field.value}
                error={field.error}
              />
            )}
          </Field>

          <Field name="cover.item" type="File">
            {(field, props) => (
              <FileInput
                {...props}
                label="Couverture"
                value={field.value}
                accept="image/*"
                required={true}
                error={field.error}
              />
            )}
          </Field>

          <Field name="path.item" type="File">
            {(field, props) => (
              <FileInput
                {...props}
                label="Vidéo"
                value={field.value}
                accept="video/*"
                required={true}
                error={field.error}
              />
            )}
          </Field>

          <Field name="svg_path.item" type="File">
            {(field, props) => (
              <FileInput
                {...props}
                label="SVG Mask"
                value={field.value}
                accept="svg/*"
                required={true}
                error={field.error}
              />
            )}
          </Field>

          <Field name="youtube_url" type="string">
            {(field, props) => (
              <TextInput
                {...props}
                type="text"
                label="Url Youtube"
                required={true}
                value={field.value}
                error={field.error}
              />
            )}
          </Field>

          <div class="card-actions flex justify-end gap-4">
            <button
              type="submit"
              class="btn btn-primary"
              disabled={loading.value}
            >
              {loading.value && <span class="loading loading-spinner"></span>}
              Créer la vidéo
            </button>
            <Link href="../" class="btn btn-outline btn-error">
              Annuler
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
});
