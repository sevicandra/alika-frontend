"use client";
import { useState, useRef, DragEvent, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Icon from "@/component/Atoms/LabelIcon";
import { useTable } from "@/context/table.context";
import { useForm } from "@/context/form.context";
import Form from "@/component/Organisms/Form";
export default function Page({
  params,
}: {
  params: Promise<{
    mutasi_id: string;
    pembayaran_id: string;
    dokumen_id: string;
  }>;
}) {
  const router = useRouter();
  const { addNotification } = useNotification();
  const { setRefresh } = useTable();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { mutasi_id, pembayaran_id, dokumen_id } = use(params);

  const { input, setInput, getValidationError, setValidationErrors } =
    useForm();

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    const formData = new FormData();
    formData.append("file", input.file, input.file.name);

    try {
      setLoading(true);
      setValidationErrors({});
      const res = await fetch(
        `/api/Mutasi/Pegawai/Mutasi/${mutasi_id}/Pembayaran/${pembayaran_id}/Dokumen/${dokumen_id}/File`,
        {
          headers: {
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "POST",
          body: formData,
        },
      );
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
        title: "Import Pegawai",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Import Pegawai",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      if (droppedFiles[0].type === "application/pdf") {
        setInput({ ...input, file: droppedFiles[0] });
        setValidationErrors({});
      } else {
        setValidationErrors({
          field: "file",
          message: "Hanya file PDF yang diizinkan.",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      if (selectedFiles[0].type === "application/pdf") {
        setInput({ ...input, file: selectedFiles[0] });
        setValidationErrors({});
      } else {
        setValidationErrors({
          field: "file",
          message: "Hanya file PDF yang diizinkan.",
        });
      }
    }
  };

  return (
    <Form
      title="Upload Dokumen Pendukung"
      onCancel={() => router.back()}
      submitForm={submitForm}
      loading={loading}
      variant="positive"
      confirmText="Import"
      cancelText="Batalkan"
    >
      <div className="card-body">
        <p className="text-sm text-base-content/70">
          Pastikan file yang diunggah dalam format PDF
        </p>

        <div
          className={`relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-base-content/20 bg-base-200 hover:border-primary/50"
          } ${getValidationError("nomor") ? "border-error" : ""}`}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Icon icon="CloudUpload" height={20} />
          <p className="text-center text-sm text-base-content/70">
            <span className="font-semibold text-primary">
              Klik untuk mengunggah
            </span>{" "}
            atau seret dan lepas
          </p>
          <p className="text-xs text-base-content/50">Hanya PDF</p>
          <input
            ref={fileInputRef}
            name="file"
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </div>
        {input.file && (
          <div className="rounded-md border border-base-content/20 bg-base-200 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="truncate pr-2">{input.file.name}</span>
              <button
                type="button"
                onClick={() => {
                  setInput({ ...input, file: undefined });
                  setValidationErrors({});
                }}
                className="btn btn-circle text-error btn-ghost btn-xs"
              >
                <Icon icon="x" height={16} />
              </button>
            </div>
          </div>
        )}
        {getValidationError("file") && (
          <label className="label">
            <span className="label-text-alt flex items-center gap-1 text-error">
              <Icon icon="CircleAlert" height={16} />{" "}
              {getValidationError("file")}
            </span>
          </label>
        )}
      </div>
    </Form>
  );
}
