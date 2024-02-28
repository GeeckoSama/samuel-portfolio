import { component$, type QRL } from "@builder.io/qwik";
import { InputError } from "./InputError";

type CheckboxProps = {
  ref: QRL<(element: HTMLInputElement) => void>;
  name: string;
  value?: string;
  checked?: boolean;
  onInput$: (event: Event, element: HTMLInputElement) => void;
  onChange$: (event: Event, element: HTMLInputElement) => void;
  onBlur$: (event: Event, element: HTMLInputElement) => void;
  required?: boolean;
  label: string;
  error?: string;
};

/**
 * Checkbox that allows users to select an option. The label next to the
 * checkbox describes the selection option.
 *
 * @param props - Checkbox properties
 * @param props.label - Label to display next to the checkbox
 * @param props.error - Error message to display if the checkbox is invalid
 * @param props.name - Name of the checkbox
 * @param props.required - Whether the checkbox is required
 * @param props.ref - Reference to the checkbox element
 * @param props.value - Value of the checkbox
 * @param props.checked - Whether the checkbox is checked
 * @param props.onInput$ - Event handler for the input event
 * @param props.onChange$ - Event handler for the change event
 * @param props.onBlur$ - Event handler for the blur event
 * @returns Checkbox component
 */
export const Checkbox = component$(
  ({ label, error, ...props }: CheckboxProps) => {
    const { name, required } = props;
    return (
      <div class="form-control">
        <label class="label cursor-pointer">
          <input
            {...props}
            class="checkbox"
            type="checkbox"
            id={name}
            aria-invalid={!!error}
            aria-errormessage={`${name}-error`}
          />
          <span class="label-text">{label}</span>{" "}
          {required && <span class="text-red-400">*</span>}
        </label>
        <InputError name={name} error={error} />
      </div>
    );
  },
);
