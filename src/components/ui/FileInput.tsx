import {
  component$,
  type NoSerialize,
  type QRL,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { InputLabel } from "./InputLabel";
import { InputError } from "./InputError";

type FileInputProps = {
  ref: QRL<(element: HTMLInputElement) => void>;
  name: string;
  value:
    | NoSerialize<Blob>
    | NoSerialize<Blob>[]
    | NoSerialize<File>
    | NoSerialize<File>[]
    | null
    | undefined;
  onInput$: (event: Event, element: HTMLInputElement) => void;
  onChange$: (event: Event, element: HTMLInputElement) => void;
  onBlur$: (event: Event, element: HTMLInputElement) => void;
  accept?: string;
  required?: boolean;
  multiple?: boolean;
  class?: string;
  label?: string;
  error?: string;
};

/**
 * File input field that users can click or drag files into. Various
 * decorations can be displayed in or around the field to communicate the entry
 * requirements.
 *
 * @param props - File input properties
 * @param props.label - Label to display next to the file input
 * @param props.error - Error message to display if the file input is invalid
 * @param props.name - Name of the file input
 * @param props.required - Whether the file input is required
 * @param props.ref - Reference to the file input element
 * @param props.value - Value of the file input
 * @param props.onInput$ - Event handler for the input event
 * @param props.onChange$ - Event handler for the change event
 * @param props.onBlur$ - Event handler for the blur event
 * @param props.accept - File types that the file input accepts
 * @param props.multiple - Whether the file input accepts multiple files
 * @returns File input component
 */
export const FileInput = component$(
  ({ value, label, error, ...props }: FileInputProps) => {
    const { name, required } = props;

    // Create computed value of selected files
    const files = useSignal<NoSerialize<Blob>[] | NoSerialize<File>[]>();
    useTask$(({ track }) => {
      track(() => value);
      files.value = value ? (Array.isArray(value) ? value : [value]) : [];
    });

    return (
      <div>
        <InputLabel name={name} label={label} required={required} />
        <input
          {...props}
          class="file-input file-input-bordered w-full"
          type="file"
          id={name}
          aria-invalid={!!error}
          aria-errormessage={`${name}-error`}
        />

        <InputError name={name} error={error} />
      </div>
    );
  },
);
