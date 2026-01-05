"use client";
import { useState, useRef } from "react";
import { useSanggahContext } from "@/context/mutasi/user";

export default function SanggahForm() {
  const { referensiHubungan, addRevisi } = useSanggahContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string;
      message: string;
    }[]
  >([]);
  const [data, setData] = useState<{
    nama: string;
    nik: string;
    hubungan: string;
    tanggal_lahir: string;
    pekerjaan: string;
    status: string;
    file: File | null;
    catatan: string;
  }>({
    nama: "",
    nik: "",
    tanggal_lahir: "",
    pekerjaan: "",
    hubungan: "",
    status: "",
    file: null,
    catatan: "",
  });

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors: {
      field: string;
      message: string;
    }[] = [];
    if (!data.nama) validationErrors.push({ field: "nama", message: "Nama belum diisi" });
    if (!data.nik) validationErrors.push({ field: "nik", message: "NIK belum diisi" });
    if (!/^\d{16}$/.test(data.nik)) {
      validationErrors.push({
        field: "nik",
        message: "NIK harus terdiri dari 16 angka",
      });
    }
    if (!data.tanggal_lahir)
      validationErrors.push({
        field: "tanggal_lahir",
        message: "Tanggal lahir belum diisi",
      });
    if (!data.pekerjaan)
      validationErrors.push({
        field: "pekerjaan",
        message: "Pekerjaan belum diisi",
      });
    if (!data.hubungan)
      validationErrors.push({
        field: "hubungan",
        message: "Hubungan belum diisi",
      });
    if (!data.status) validationErrors.push({ field: "status", message: "Status belum diisi" });
    if (!data.file) validationErrors.push({ field: "file", message: "File belum diisi" });
    if (!data.catatan)
      validationErrors.push({
        field: "catatan",
        message: "Catatan belum diisi",
      });
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      return;
    }
    addRevisi({
      action: "add",
      nama: data.nama,
      data: {
        nama: {
          new: data.nama,
        },
        nik: {
          new: data.nik,
        },
        hubungan: {
          new: data.hubungan,
        },
        tanggal_lahir: {
          new: data.tanggal_lahir,
        },
        pekerjaan: {
          new: data.pekerjaan,
        },
        status: {
          new: data.status,
        },
      },
      catatan: data.catatan,
      file: data.file as File,
    });

    setData({
      nama: "",
      nik: "",
      hubungan: "",
      tanggal_lahir: "",
      pekerjaan: "",
      status: "",
      file: null,
      catatan: "",
    });
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={submitForm}>
      <div className="grid grid-cols-2 gap-1 p-4">
        <div>
          <label className="label text-base-content after:text-error after:content-['*']">
            Nama:
          </label>
          <input
            type="text"
            className={`input input-sm w-full border-base-content/20 bg-base-200 text-base-content focus:outline-none ${validationErrors.find((item) => item.field === "nama") ? "border-error" : ""}`}
            placeholder="Type here"
            name="nama"
            required
            autoComplete="off"
            value={data.nama}
            onChange={(e) => setData({ ...data, nama: e.target.value })}
          />
          {validationErrors.find((e) => e.field === "nama") && (
            <p className="label text-xs font-bold text-error">
              {validationErrors.find((e) => e.field === "nama")?.message}
            </p>
          )}
        </div>
        <div>
          <label className="label text-base-content after:text-error after:content-['*']">
            NIK:
          </label>
          <input
            type="text"
            className={`input input-sm w-full border-base-content/20 bg-base-200 text-base-content focus:outline-none ${validationErrors.find((item) => item.field === "nik") ? "border-error" : ""}`}
            placeholder="Type here"
            name="nik"
            autoComplete="off"
            value={data.nik}
            onChange={(e) => setData({ ...data, nik: e.target.value })}
          />
          {validationErrors.find((e) => e.field === "nik") && (
            <p className="label text-xs font-bold text-error">
              {validationErrors.find((e) => e.field === "nik")?.message}
            </p>
          )}
        </div>
        <div>
          <label className="label text-base-content after:text-error after:content-['*']">
            Hubungan:
          </label>
          <select
            name="hubungan"
            className={`select w-full border-base-content/20 bg-base-200 select-sm text-base-content focus:outline-none ${validationErrors.find((item) => item.field === "hubungan") ? "select-error" : ""}`}
            required
            value={data.hubungan}
            onChange={(e) => setData({ ...data, hubungan: e.target.value })}
          >
            <option disabled value="">
              Hubungan
            </option>
            {referensiHubungan.map((item) => (
              <option key={item.kode} value={item.kode}>
                {item.nama}
              </option>
            ))}
          </select>
          {validationErrors.find((e) => e.field === "hubungan") && (
            <p className="label text-xs font-bold text-error">
              {validationErrors.find((e) => e.field === "hubungan")?.message}
            </p>
          )}
        </div>
        <div>
          <label className="label text-base-content after:text-error after:content-['*']">
            Tanggal Lahir:
          </label>
          <input
            type="date"
            className={`input input-sm w-full border-base-content/20 bg-base-200 text-base-content focus:outline-none ${validationErrors.find((item) => item.field === "tanggal_lahir") ? "border-error" : ""}`}
            name="tanggal_lahir"
            autoComplete="off"
            required
            value={data.tanggal_lahir}
            onChange={(e) => setData({ ...data, tanggal_lahir: e.target.value })}
          />
          {validationErrors.find((e) => e.field === "tanggal_lahir") && (
            <p className="label text-xs font-bold text-error">
              {validationErrors.find((e) => e.field === "tanggal_lahir")?.message}
            </p>
          )}
        </div>
        <div>
          <label className="label text-base-content after:text-error after:content-['*']">
            Pekerjaan:
          </label>
          <input
            type="text"
            className={`input input-sm w-full border-base-content/20 bg-base-200 text-base-content focus:outline-none ${validationErrors.find((item) => item.field === "pekerjaan") ? "border-error" : ""}`}
            name="pekerjaan"
            autoComplete="off"
            required
            value={data.pekerjaan}
            placeholder="Type here"
            onChange={(e) => setData({ ...data, pekerjaan: e.target.value })}
          />
          {validationErrors.find((e) => e.field === "pekerjaan") && (
            <p className="label text-xs font-bold text-error">
              {validationErrors.find((e) => e.field === "pekerjaan")?.message}
            </p>
          )}
        </div>
        <div>
          <label className="label text-base-content after:text-error after:content-['*']">
            Status Tanggungan:
          </label>
          <select
            name="status"
            className={`select w-full border-base-content/20 bg-base-200 select-sm text-base-content focus:outline-none ${validationErrors.find((item) => item.field === "status") ? "select-error" : ""}`}
            required
            value={data.status}
            onChange={(e) => setData({ ...data, status: e.target.value })}
          >
            <option disabled value="">
              Status Tanggungan
            </option>
            <option value="TIDAK_TERTANGGUNG">TIDAK TERTANGGUNG</option>
            <option value="TERTANGGUNG">TERTANGGUNG</option>
          </select>
          {validationErrors.find((e) => e.field === "status") && (
            <p className="label text-xs font-bold text-error">
              {validationErrors.find((e) => e.field === "status")?.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label className="label text-base-content after:text-error after:content-['*']">
            Catatan:
          </label>
          <textarea
            name="catatan"
            className={`textarea w-full border-base-content/20 bg-base-200 text-base-content focus:outline-none ${validationErrors.find((item) => item.field === "catatan") ? "border-error" : ""}`}
            value={data.catatan}
            placeholder="Type here"
            onChange={(e) => setData({ ...data, catatan: e.target.value })}
          />
          {validationErrors.find((e) => e.field === "catatan") && (
            <p className="label text-xs font-bold text-error">
              {validationErrors.find((e) => e.field === "catatan")?.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label className="label text-base-content after:text-error after:content-['*']">
            Dokumen Pendukung:
          </label>
          <input
            ref={fileInputRef}
            name="file"
            type="file"
            className={`file-input w-full border-base-content/20 bg-base-200 file-input-sm text-base-content focus:outline-none ${validationErrors.find((item) => item.field === "file") ? "file-input-error" : ""}`}
            accept="application/pdf"
            onChange={(e) => setData({ ...data, file: e.target.files?.[0] ?? null })}
          />
          {validationErrors.find((e) => e.field === "file") && (
            <p className="label text-xs font-bold text-error">
              {validationErrors.find((e) => e.field === "file")?.message}
            </p>
          )}
        </div>
        <button type="submit" className="btn col-span-2 mt-4 btn-sm btn-accent">
          Submit
        </button>
      </div>
    </form>
  );
}
