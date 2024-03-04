import { component$, type QRL, useSignal, useTask$ } from "@builder.io/qwik";
import { InputError } from "./input-error";
import { InputLabel } from "./input-label";

type SelectProps = {
  ref: QRL<(element: HTMLSelectElement) => void>;
  name: string;
  value: string | string[] | null | undefined;
  onInput$: (event: Event, element: HTMLSelectElement) => void;
  onChange$: (event: Event, element: HTMLSelectElement) => void;
  onBlur$: (event: Event, element: HTMLSelectElement) => void;
  options: { label: string; value: string }[];
  multiple?: boolean;
  size?: number;
  placeholder?: string;
  required?: boolean;
  class?: string;
  label?: string;
  error?: string;
};

/**
 * Select field that allows users to select predefined values. Various
 * decorations can be displayed in or around the field to communicate the
 * entry requirements.
 *
 * @param props - Select properties
 * @param props.label - Label to display next to the select
 * @param props.error - Error message to display if the select is invalid
 * @param props.name - Name of the select
 * @param props.required - Whether the select is required
 *  @param props.ref - Reference to the select element
 * @param props.value - Value of the select
 * @param props.onInput$ - Event handler for the input event
 * @param props.onChange$ - Event handler for the change event
 * @param props.onBlur$ - Event handler for the blur event
 * @param props.options - List of options to display in the select
 * @param props.multiple - Whether the select allows multiple selections
 * @param props.size - Number of options to display at once
 * @param props.placeholder - Placeholder text to display in the select
 * @param props.class - Additional class names to apply to the select
 * @returns Select component
 */
export const Select = component$(
  ({ value, options, label, error, ...props }: SelectProps) => {
    const { name, required, placeholder } = props;

    // Create computed value of selected values
    const values = useSignal<string[]>();
    useTask$(({ track }) => {
      track(() => value);
      values.value = Array.isArray(value)
        ? value
        : value && typeof value === "string"
          ? [value]
          : [];
    });

    return (
      <label class="form-control w-full max-w-xs">
        <InputLabel name={name} label={label} required={required} />
        <select
          {...props}
          class="select select-bordered"
          id={name}
          aria-invalid={!!error}
          aria-errormessage={`${name}-error`}
        >
          <option value="" disabled hidden selected={!value}>
            {placeholder}
          </option>
          {options.map(({ label, value }) => (
            <option
              key={value}
              value={value}
              selected={values.value?.includes(value)}
            >
              {label}
            </option>
          ))}
        </select>
        <InputError name={name} error={error} />
      </label>
    );
  },
);
