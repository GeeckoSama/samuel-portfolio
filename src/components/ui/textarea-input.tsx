import { component$, type QRL, useSignal, useTask$ } from "@builder.io/qwik";
import { InputError } from "./input-error";
import { InputLabel } from "./input-label";

interface TextareaInputProps {
  ref: QRL<(element: HTMLTextAreaElement) => void>;
  name: string;
  value: string | number | undefined;
  onInput$: (event: Event, element: HTMLTextAreaElement) => void;
  onChange$: (event: Event, element: HTMLTextAreaElement) => void;
  onBlur$: (event: Event, element: HTMLTextAreaElement) => void;
  placeholder?: string;
  required?: boolean;
  class?: string;
  label?: string;
  error?: string;
  form?: string;
}

export const TextareaInput = component$(
  ({ label, value, error, ...props }: TextareaInputProps) => {
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
        <textarea
          {...props}
          class="textarea textarea-bordered w-full"
          id={name}
          value={input.value}
          aria-invalid={!!error}
          aria-errormessage={`${name}-error`}
        ></textarea>
        <InputError name={name} error={error} />
      </label>
    );
  },
);
