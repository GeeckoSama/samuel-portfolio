import type { NoSerialize, QRL } from "@builder.io/qwik";
import { $, component$, useSignal } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { FileInput } from "@components/ui/file-input";
import { TextAreaInput } from "@components/ui/text-area-input";
import { TextInput } from "@components/ui/text-input";
import { firestore, storage } from "@libs/firebase";
import type { Video } from "@libs/video.type";
import type { InitialValues, SubmitHandler } from "@modular-forms/qwik";
import { insert, remove, useForm, valiForm$ } from "@modular-forms/qwik";
import { HiArrowLeftSolid, HiTrashSolid } from "@qwikest/icons/heroicons";
import { Image } from "@unpic/qwik";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { UploadResult } from "firebase/storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import type { Input } from "valibot";
import { array, minLength, object, optional, special, string } from "valibot";

const isFile = (input: unknown) => input instanceof File;

export const VideoSchema = object({
  id: string(),
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
    item: optional(special<NoSerialize<File>>(isFile)),
    path: optional(string()),
  }),
  path: object({
    item: optional(special<NoSerialize<File>>(isFile)),
    path: optional(string()),
  }),
  svg_path: object({
    item: optional(special<NoSerialize<File>>(isFile)),
    path: optional(string()),
  }),
  youtube_url: string([minLength(1, "L'url youtube est requise")]),
});

export type VideoForm = Input<typeof VideoSchema>;

export const useFormLoader = routeLoader$<InitialValues<VideoForm>>(
  async (requestEvent) => {
    const id = requestEvent.params.id;
    if (!id) throw new Error("Missing id");
    const docRef = doc(firestore(), `videos/${id}`);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) throw new Error("Document does not exist");
    const video = { id: snapshot.id, ...snapshot.data() } as Video;
    return {
      id: video.id,
      title: video.title,
      description: video.description,
      credits: video.credits,
      localisations: video.localisations,
      production_date: new Date(video.production_date)
        .toISOString()
        .split("T")[0],
      cover: { item: undefined, path: video.cover },
      path: { item: undefined, path: video.path },
      svg_path: { item: undefined, path: video.svg_path },
      youtube_url: video.youtube_url,
    };
  },
);

export default component$(() => {
  const cdn = import.meta.env.PUBLIC_IMGIX_URL;
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
      const uploads: Array<Promise<UploadResult> | null> = [];
      /* upload cover */
      if (!values.cover.item) {
        console.log("Aucune couverture n'a été sélectionnée");
        uploads.push(null);
      } else {
        const coverRef = ref(
          storage(),
          `videos/${values.title}/${values.cover.item.name}`,
        );
        uploads.push(uploadBytes(coverRef, values.cover.item));
      }

      /* upload path */
      if (!values.path.item) {
        console.log("Aucune vidéo n'a été sélectionnée");
        uploads.push(null);
      } else {
        const pathRef = ref(
          storage(),
          `videos/${values.title}/${values.path.item.name}`,
        );
        uploads.push(uploadBytes(pathRef, values.path.item));
      }

      /* upload svg */
      if (!values.svg_path.item) {
        console.log("Aucun svg n'a été sélectionné");
        uploads.push(null);
      } else {
        const svgRef = ref(
          storage(),
          `videos/${values.title}/${values.svg_path.item.name}`,
        );
        uploads.push(uploadBytes(svgRef, values.svg_path.item));
      }

      const [cover, path, svg] = await Promise.all(uploads);
      let videoUrl: string | undefined = undefined;
      if (path) {
        videoUrl = await getDownloadURL(path.ref);
      }
      console.log(cover, path, svg);

      const videoRef = doc(firestore(), `videos/${values.id}`);
      await updateDoc(videoRef, {
        title: values.title,
        description: values.description,
        credits: values.credits,
        localisations: values.localisations,
        production_date: new Date(values.production_date).getTime(),
        cover: cover ? cover.ref.fullPath : values.cover.path,
        path: videoUrl ? videoUrl : values.path.path,
        svg_path: svg ? svg.ref.fullPath : values.svg_path.path,
        youtube_url: values.youtube_url,
        create_at: Date.now(),
        update_at: Date.now(),
      });
      loading.value = false;
      console.log("Video updated successfully.");
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
          <Field name="id" type="string">
            {(field, props) => <input {...props} type="hidden" />}
          </Field>

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

          <Field name="cover.path" type="string">
            {(field, props) => (
              <div>
                <input {...props} type="hidden" />
                <Image
                  src={cdn + field.value}
                  layout="constrained"
                  alt="cover"
                  class="mx-auto h-auto w-full"
                />
              </div>
            )}
          </Field>
          <Field name="cover.item" type="File">
            {(field, props) => (
              <FileInput
                {...props}
                label="Couverture"
                value={field.value}
                accept="image/*"
                required={false}
                error={field.error}
              />
            )}
          </Field>

          <Field name="path.path" type="string">
            {(field, props) => (
              <div>
                <input {...props} type="hidden" />
                <video controls muted class="h-full w-full object-cover">
                  <source src={field.value} type="video/mp4" />
                </video>
              </div>
            )}
          </Field>
          <Field name="path.item" type="File">
            {(field, props) => (
              <FileInput
                {...props}
                label="Vidéo"
                value={field.value}
                accept="video/*"
                required={false}
                error={field.error}
              />
            )}
          </Field>

          <Field name="svg_path.path" type="string">
            {(field, props) => (
              <div>
                <input {...props} type="hidden" />
                <Image
                  src={cdn + field.value}
                  layout="constrained"
                  alt="cover"
                  class="mx-auto h-auto w-full"
                />
              </div>
            )}
          </Field>
          <Field name="svg_path.item" type="File">
            {(field, props) => (
              <FileInput
                {...props}
                label="SVG Mask"
                value={field.value}
                accept="svg/*"
                required={false}
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
              Modifié la vidéo
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
