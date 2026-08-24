"use client";
import PopUp from "@/component/Organisms/PopUp";
// Tipe dipertahankan sebagai ConfirmationProps untuk backward compatibility
export type FormDialogProps = {
  title: string;
  onCancel: () => void;
  variant?: "destructive" | "positive" | "warning";
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  submitForm?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
};

// Nama komponen diperbaiki: FormDialog (sebelumnya: Confirmation — tidak konsisten dengan nama file Form.tsx)
export default function FormDialog({
  title,
  onCancel,
  variant = "positive",
  loading = false,
  cancelText = "Batal",
  submitForm,
  confirmText,
  children,
}: FormDialogProps) {
  const variantStyles = {
    destructive: {
      buttonClass: "btn-error",
      defaultConfirmText: "Hapus",
    },
    positive: {
      buttonClass: "btn-success",
      defaultConfirmText: "Lanjutkan",
    },
    warning: {
      buttonClass: "btn-warning",
      defaultConfirmText: "Lanjutkan",
    },
  };
  const { buttonClass, defaultConfirmText } = variantStyles[variant as keyof typeof variantStyles];
  return (
    <PopUp title={title} className="w-lg">
      <form onSubmit={submitForm} noValidate autoComplete="off">
        <div className="bg-base-100 shadow-xl">
          <div className="p-4">{children}</div>
          <div className="flex items-center justify-end gap-4 bg-base-200/50 px-8 py-4">
            <button
              className="btn btn-ghost"
              onClick={onCancel}
              disabled={loading}
              type="button"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className={`btn ${buttonClass}`}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                confirmText || defaultConfirmText
              )}
            </button>
          </div>
        </div>
      </form>
    </PopUp>
  );
}
