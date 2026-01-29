"use client";
import {
  createContext,
  useState,
  useMemo,
  useContext,
  useCallback,
} from "react";
type FormContextType = {
  input: { [key: string]: any };
  setInput: (input: { [key: string]: any }) => void;
  getValidationError: (field: string) =>
    | string
    | undefined;
  setValidationErrors: (validationErrors: { [key: string]: string }) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState<{ [key: string]: any }>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const getValidationError = useCallback(
    (field: string) => {
      return validationErrors[field]
    },
    [validationErrors],
  );

  const value = useMemo(
    () => ({
      input,
      setInput,
      getValidationError,
      setValidationErrors,
    }),
    [input, getValidationError],
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
