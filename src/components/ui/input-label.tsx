import { component$ } from "@builder.io/qwik";

type InputLabelProps = {
  name: string;
  label?: string;
  required?: boolean;
};

/**
 * Label for an input field. The label can be used to describe the input field
 * and indicate if the field is required.
 *
 * @param name - Name of the input field.
 * @param label - Text to display as the label.
 * @param required - If the field is required.
 * @returns The label element.
 */
export const InputLabel = component$(
  ({ name, label, required }: InputLabelProps) => (
    <>
      {label && (
        <label class="label" for={name}>
          <span class="label-text">{label}</span>
          {required && <span class="tabel-text-alt text-red-400">*</span>}
        </label>
      )}
    </>
  ),
);
