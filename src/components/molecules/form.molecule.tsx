"use client";
import Button from "../atoms/button.atom";
export type ConfirmationProps = {
  onCancel: () => void;
  variant?: "destructive" | "positive" | "warning";
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  submitForm?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
};

export default function Form({
  onCancel,
  variant = "positive",
  loading = false,
  cancelText = "Batal",
  submitForm,
  confirmText,
  children,
}: ConfirmationProps) {
  const variantStyles = {
    destructive: {
      buttonVariant: "error",
      defaultConfirmText: "Hapus",
    },
    positive: {
      buttonVariant: "success",
      defaultConfirmText: "Simpan",
    },
    warning: {
      buttonVariant: "warning",
      defaultConfirmText: "Lanjutkan",
    },
  } as const;
  const { buttonVariant, defaultConfirmText } = variantStyles[variant];
  return (
    <form onSubmit={submitForm} noValidate autoComplete="off">
      <div className="bg-base-100 shadow-xl">
        <div className="p-4">{children}</div>
        <div className="flex items-center justify-end gap-4 bg-base-200/50 px-8 py-4">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
            type="button"
          >
            {cancelText}
          </Button>
          <Button variant={buttonVariant} disabled={loading} type="submit">
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              confirmText || defaultConfirmText
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
