"use client";
import PopUp from "@/component/Molecules/PopUp";
import Icon from "@/component/Atoms/LabelIcon";

export type ConfirmationProps = {
  title: string;
  message: string;
  icon: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "destructive" | "positive" | "warning";
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
};

export default function Confirmation({
  title,
  message,
  icon,
  onConfirm,
  onCancel,
  variant = "destructive",
  loading = false,
  confirmText,
  cancelText = "Batal",
}: ConfirmationProps) {
  const variantStyles = {
    destructive: {
      iconColor: "text-error",
      buttonClass: "btn-error",
      defaultConfirmText: "Ya, Hapus",
    },
    positive: {
      iconColor: "text-success",
      buttonClass: "btn-success",
      defaultConfirmText: "Ya, Lanjutkan",
    },
    warning: {
      iconColor: "text-warning",
      buttonClass: "btn-warning",
      defaultConfirmText: "Ya, Lanjutkan",
    },
  };
  const { iconColor, buttonClass, defaultConfirmText } = variantStyles[variant];

  return (
    <PopUp title={title} className="w-lg">
      <div className="flex flex-col items-center gap-2 p-4 text-center">
        <div className={iconColor}>
          <Icon icon={icon} height="48px" />
        </div>
        <h2 className="text-2xl font-bold">Anda Yakin?</h2>
        <p className="text-base-content/80">{message}</p>
        <div className="flex w-full justify-center gap-4 pt-4">
          <button
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            className={`btn ${buttonClass}`}
            onClick={onConfirm}
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
    </PopUp>
  );
}
