import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { isBrowser } from "@builder.io/qwik/build";

type InputErrorProps = {
  name: string;
  error?: string;
};

/**
 * Input error that tells the user what to do to fix the problem.
 *
 * @param name - Name of the input field.
 * @param error - Error message to display.
 * @returns The error element.
 */
export const InputError = component$(({ name, error }: InputErrorProps) => {
  // Use frozen error signal
  const frozenError = useSignal<string>();

  // Freeze error while element collapses to prevent UI from jumping
  useTask$(({ track, cleanup }) => {
    const nextError = track(() => error);
    if (isBrowser && !nextError) {
      const timeout = setTimeout(() => (frozenError.value = nextError), 200);
      cleanup(() => clearTimeout(timeout));
    } else {
      frozenError.value = nextError;
    }
  });

  return (
    <div class="label" id={`${name}-error`}>
      <span class="label-text-alt text-red-400">{frozenError.value}</span>
    </div>
  );
});
