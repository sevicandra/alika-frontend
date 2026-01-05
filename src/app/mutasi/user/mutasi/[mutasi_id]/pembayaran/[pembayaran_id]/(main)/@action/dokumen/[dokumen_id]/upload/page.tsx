"use client";
import { useState, useRef, DragEvent, use } from "react";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Loading from "@/component/Molecules/Loading";
import Icon from "@/component/Atoms/LabelIcon";
import { useTable } from "@/context/table.context";
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
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string;
      message: string;
    }[]
  >([]);
  const { mutasi_id, pembayaran_id, dokumen_id } = use(params);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setValidationErrors([{ field: "file", message: "File belum dipilih." }]);
      addNotification({
        title: "Gagal",
        message: "Silakan pilih file terlebih dahulu.",
        variant: "error",
      });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
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
        }
      );

      if (!res.ok) {
        const { message, errors } = await res.json();
        if (res.status === 422) {
          setValidationErrors(errors);
        }
        throw new Error(message || "Terjadi kesalahan pada server.");
      }
      addNotification({
        message: "Berhasil dibuat",
        title: "Pegawai Mutasi",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Pegawai Mutasi",
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
        setFile(droppedFiles[0]);
        setValidationErrors([]);
      } else {
        setValidationErrors([{ field: "file", message: "Hanya file PDF yang diizinkan." }]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      setValidationErrors([]);
    }
  };

  return (
    <div className="flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="card relative w-full max-w-lg bg-base-100 shadow-xl">
        {loading && (
          <div className="absolute z-10 flex h-full w-full items-center justify-center rounded-box bg-base-100/80 text-primary">
            <Loading />
          </div>
        )}
        <div className="card-body">
          <p className="text-sm text-base-content/70">
            Pastikan file yang diunggah dalam format PDF dan ukuran tidak melebihi 5MB.
          </p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div
              className={`relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-base-content/20 bg-base-200 hover:border-primary/50"
              } ${validationErrors.find((item) => item.field === "file") ? "border-error" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Icon icon="CloudUpload" height={20} />
              <p className="text-center text-sm text-base-content/70">
                <span className="font-semibold text-primary">Klik untuk mengunggah</span> atau seret
                dan lepas
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

            {validationErrors.find((e) => e.field === "file") && (
              <p className="label-text-alt -mt-2 text-xs font-bold text-error">
                {validationErrors.find((e) => e.field === "file")?.message}
              </p>
            )}

            {file && !validationErrors.length && (
              <div className="rounded-md border border-base-content/20 bg-base-200 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="truncate pr-2">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="btn btn-circle text-error btn-ghost btn-xs"
                  >
                    <Icon icon="x" height={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="card-actions justify-end">
              <button type="button" onClick={() => router.back()} className="btn btn-ghost">
                Batal
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${(!file || loading) && "btn-disabled"}`}
                disabled={!file || loading}
              >
                {loading ? "Mengunggah..." : "Unggah"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
