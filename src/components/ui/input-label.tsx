import { component$ } from "@builder.io/qwik";

interface InputLabelProps {
  name: string;
  label?: string;
  required?: boolean;
}

/**
 * Label for an input field. The label can be used to describe the input field
 * and indicate if the field is required.
 *
 * @param name - Name of the input field.
 * @param label - Text to display as the label.
 * @param required - If the field is required.
 * @returns The label element.
 */
export const InputLabel = component$<InputLabelProps>((props) => (
  <>
    {props.label && (
      <div class="label">
        <span class="label-text">{props.label}</span>
        {!props.required && <span class="tabel-text-alt">(optionnel)</span>}
      </div>
    )}
  </>
));
