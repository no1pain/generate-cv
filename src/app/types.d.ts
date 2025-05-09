// This file helps TypeScript find React types
declare namespace React {
  interface StatelessComponent<P = {}> {
    (props: P): React.ReactElement | null;
  }
}

declare module "react-hook-form" {
  interface UseFormReturn<TFieldValues> {
    register: any;
    handleSubmit: any;
    control: any;
    formState: any;
  }
  export function useForm<TFieldValues>(
    config?: any
  ): UseFormReturn<TFieldValues>;
  export function useFieldArray(props: any): any;
  export const Controller: any;
}
