import { component$, type QRL, useSignal, useTask$ } from "@builder.io/qwik";
import { InputError } from "./input-error";
import { InputLabel } from "./input-label";

interface TextInputProps {
  ref: QRL<(element: HTMLInputElement) => void>;
  type: "text" | "email" | "tel" | "password" | "url" | "number" | "date";
  name: string;
  value: string | number | undefined;
  onInput$: (event: Event, element: HTMLInputElement) => void;
  onChange$: (event: Event, element: HTMLInputElement) => void;
  onBlur$: (event: Event, element: HTMLInputElement) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  class?: string;
  label?: string;
  error?: string;
  form?: string;
}

/**
 * Text input field that users can type into. Various decorations can be
 * displayed in or around the field to communicate the entry requirements.
 *
 * @param props - Text input properties
 * @param props.label - Label to display next to the text input
 * @param props.error - Error message to display if the text input is invalid
 * @param props.name - Name of the text input
 * @param props.required - Whether the text input is required
 * @param props.ref - Reference to the text input element
 * @param props.value - Value of the text input
 * @param props.onInput$ - Event handler for the input event
 * @param props.onChange$ - Event handler for the change event
 * @param props.onBlur$ - Event handler for the blur event
 * @param props.placeholder - Placeholder text to display in the text input
 * @param props.autoComplete - Autocomplete value for the text input
 * @param props.type - Type of the text input
 * @returns Text input component
 */
export const TextInput = component$(
  ({ label, value, error, ...props }: TextInputProps) => {
    const { name, required } = props;
    const input = useSignal<string | number>();
    useTask$(({ track }) => {
      if (!Number.isNaN(track(() => value))) {
        input.value = value;
      }
    });
    return (
      <label class="form-control w-full">
        <InputLabel name={name} label={label} required={required} />
        <input
          {...props}
          class="input input-bordered w-full"
          id={name}
          value={input.value}
          aria-invalid={!!error}
          aria-errormessage={`${name}-error`}
        />
        <InputError name={name} error={error} />
      </label>
    );
  },
);
