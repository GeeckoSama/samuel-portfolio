import { component$, type QRL } from "@builder.io/qwik";
import { InputError } from "./input-error";
import { InputLabel } from "./input-label";

type TextInputProps = {
  ref: QRL<(element: HTMLTextAreaElement) => void>;
  name: string;
  value: string | undefined;
  onInput$: (event: Event, element: HTMLTextAreaElement) => void;
  onChange$: (event: Event, element: HTMLTextAreaElement) => void;
  onBlur$: (event: Event, element: HTMLTextAreaElement) => void;
  placeholder?: string;
  required?: boolean;
  label?: string;
  error?: string;
  form?: string;
};

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
 * @returns Text input component
 */
export const TextAreaInput = component$(
  ({ label, value, error, ...props }: TextInputProps) => {
    const { name, required } = props;
    return (
      <div class="form-control w-full max-w-xs">
        <InputLabel name={name} label={label} required={required} />
        <textarea
          {...props}
          class="textarea textarea-bordered w-full max-w-xs"
          id={name}
          value={value}
          aria-invalid={!!error}
          aria-errormessage={`${name}-error`}
        ></textarea>
        <InputError name={name} error={error} />
      </div>
    );
  },
);
