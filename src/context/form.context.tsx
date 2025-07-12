"use client";
import { createContext, useState, useMemo, useContext } from "react";
type FormContextType = {
  input: { [key: string]: any };
  setInput: (input: { [key: string]: any }) => void;
  getValidationError: (field: string) =>
    | {
        field: string | null;
        message: string;
      }
    | undefined;
  setValidationErrors: (
    errors: {
      field: string | null;
      message: string;
    }[],
  ) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState<{ [key: string]: any }>({});
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);
  const getValidationError = (field: string) => {
    return validationErrors.find((e) => e.field === field);
  };

  const value = useMemo(
    () => ({
      input,
      setInput,
      getValidationError,
      setValidationErrors,
    }),
    [input, validationErrors],
  );
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
