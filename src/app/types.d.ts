// This file helps TypeScript find React types
declare namespace React {
  interface StatelessComponent<P = Record<string, unknown>> {
    (props: P): React.ReactElement | null;
  }
}

// Only include this if react-hook-form types are missing
// Normally you'd import these from the package itself
declare module "react-hook-form" {
  interface FormState {
    errors: Record<string, unknown>;
    isDirty: boolean;
    isSubmitting: boolean;
    isValid: boolean;
    [key: string]: unknown;
  }

  interface RegisterOptions {
    required?: boolean | string;
    pattern?: RegExp | { value: RegExp; message: string };
    [key: string]: unknown;
  }

  type RegisterFunction = (
    name: string,
    options?: RegisterOptions
  ) => {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    name: string;
    ref: React.Ref<HTMLInputElement>;
  };

  interface ControllerProps {
    name: string;
    control: unknown;
    rules?: RegisterOptions;
    render: (props: { field: Record<string, unknown> }) => React.ReactElement;
  }

  export function useForm(config?: Record<string, unknown>): {
    register: RegisterFunction;
    handleSubmit: (
      callback: (data: Record<string, unknown>) => void
    ) => (e: React.FormEvent) => void;
    control: unknown;
    formState: FormState;
  };

  export function useFieldArray(props: Record<string, unknown>): {
    fields: Array<Record<string, unknown>>;
    append: (value: Record<string, unknown>) => void;
    remove: (index: number) => void;
  };

  export const Controller: React.FC<ControllerProps>;
}
