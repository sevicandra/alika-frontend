"use client";
import PopUp from "@/component/Molecules/PopUp";
export type ConfirmationProps = {
  title: string;
  onCancel: () => void;
  variant?: "destructive" | "positive" | "warning";
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  submitForm?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
};

export default function Confirmation({
  title,
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
  const { buttonClass, defaultConfirmText } = variantStyles[variant];
  return (
    <PopUp title={title} className="w-lg">
      <form onSubmit={submitForm} noValidate>
        <div className="bg-base-100 shadow-xl">
          <div className="p-4">{children}</div>
          <div className="flex items-center justify-end gap-4 bg-base-200/50 px-8 py-4">
            <button
              className="btn btn-ghost"
              onClick={onCancel}
              disabled={loading}
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
