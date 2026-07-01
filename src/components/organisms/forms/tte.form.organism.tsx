"use client";
import Form from "@/components/molecules/form.molecule";
import {
  PasswordInput,
  DateInput,
} from "@/components/molecules/form-field.molecule";
import { useState } from "react";
import { useForm } from "@/context/form.context";
import { useNotification } from "@/context/notifikasi";
import { LuCircleAlert } from "react-icons/lu";
import { FormProvider } from "@/context/form.context";

type TTEFormProps = {
  action: (data: {
    passphrase: string;
    tanggal: string;
    confirmation: boolean;
  }) => Promise<Response>;
  confirmationText?: string;
  dateInput?: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

function TTEForm({
  action,
  confirmationText = "Dengan ini saya menyatakan bahwa dokumen ini telah diverifikasi dan sesuai dengan peraturan yang berlaku",
  dateInput = false,
  onCancel,
  onSuccess,
}: TTEFormProps) {
  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      setValidationErrors({});
      const res = await action({
        passphrase: input.passphrase,
        tanggal: input.tanggal,
        confirmation: input.confirmation,
      });
      const { message, error } = await res.json();
      if (!res.ok) {
        if (res.status === 422) {
          setValidationErrors(error.details);
        }
        throw new Error(
          error.message
            ? `${error.message} (Status: ${res.status})`
            : "Unknown Server Error",
        );
      }
      addNotification({
        message: `${message} (Status: ${res.status})`,
        title: "TTE Dokumen",
      });
      onSuccess();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "TTE Dokumen",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form
      onCancel={onCancel}
      variant="positive"
      loading={loading}
      cancelText="Batal"
      submitForm={submitForm}
    >
      <PasswordInput
        name="passphrase"
        label="Passphrase"
        error={getValidationError("passphrase") ? true : false}
        errorMessage={getValidationError("passphrase")}
        value={input.passphrase || ""}
        onChange={(e) => {
          setInput({ ...input, passphrase: e.target.value });
        }}
      />
      {dateInput && (
        <DateInput
          name="tanggal"
          label="Tanggal"
          value={input.tanggal || ""}
          onChange={(e) => {
            setInput({ ...input, tanggal: e.target.value });
          }}
        />
      )}
      <div className="form-control">
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <input
            type="checkbox"
            name="confirmation"
            className="checkbox"
            required
            checked={input.confirmation || false}
            onChange={(e) => {
              setInput({ ...input, confirmation: e.target.checked });
            }}
          />
          <label className="label">
            <span className="label-text text-justify text-wrap">
              {confirmationText}
            </span>
          </label>
          {getValidationError("confirmation") && (
            <label className="col-span-2 label">
              <span className="label-text-alt flex items-center gap-1 text-xs text-error">
                <LuCircleAlert className="h-4 w-4" />{" "}
                {getValidationError("confirmation")}
              </span>
            </label>
          )}
        </div>
      </div>
    </Form>
  );
}

export default function TTEFormWrapper(props: TTEFormProps) {
  return (
    <FormProvider>
      <TTEForm {...props} />
    </FormProvider>
  );
}
