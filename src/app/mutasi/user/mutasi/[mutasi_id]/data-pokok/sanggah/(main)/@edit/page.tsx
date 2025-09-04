"use client";
import { useState, useRef, useEffect } from "react";
import { useSanggahContext } from "@/context/mutasi/user";
import { snackToTitleCase } from "@/helpers/string.helper";
import { useNotification } from "@/context/notifikasi";

export default function SanggahForm() {
  const { referensiHubungan, dataKeluarga, revisi, addRevisi } =
    useSanggahContext();
  const { addNotification } = useNotification();
  const [selectedData, setSelectedData] = useState<string>("");
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

  useEffect(() => {
    if (selectedData) {
      const selectedKeluarga = dataKeluarga.find(
        (item) => item.id === selectedData,
      );
      if (selectedKeluarga) {
        setData({
          nama: selectedKeluarga.nama || "",
          nik: selectedKeluarga.nik || "",
          tanggal_lahir: selectedKeluarga.tanggal_lahir || "",
          pekerjaan: selectedKeluarga.pekerjaan || "",
          hubungan: selectedKeluarga.hubungan || "",
          status: selectedKeluarga.status || "",
          file: null,
          catatan: "",
        });
      }
    }
  }, [selectedData, dataKeluarga]);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors: {
      field: string;
      message: string;
    }[] = [];
    if (!data.nama)
      validationErrors.push({ field: "nama", message: "Nama belum diisi" });
    if (!data.nik)
      validationErrors.push({ field: "nik", message: "NIK belum diisi" });
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
    if (!data.status)
      validationErrors.push({ field: "status", message: "Status belum diisi" });
    if (
      dataKeluarga.find((item) => item.id === selectedData)?.status ===
        "TIDAK_TERTANGGUNG" &&
      data.status === "TERTANGGUNG" &&
      !data.file
    )
      validationErrors.push({ field: "file", message: "File belum diisi" });

    if (!data.catatan)
      validationErrors.push({
        field: "catatan",
        message: "Catatan belum diisi",
      });

    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    if (
      revisi
        .filter((r) => r.action !== "add")
        .some((r) => r.id === selectedData)
    ) {
      addNotification({
        message: "Data sudah dibuat, silahkan hapus dan buat ulang",
        title: "Edit keluarga",
      });
      return;
    }
    const dataSanggah: {
      [key: string]: {
        old?: string;
        new: string;
      };
    } = {};

    if (
      data.nama !== dataKeluarga.find((item) => item.id === selectedData)?.nama
    )
      dataSanggah.nama = {
        new: data.nama,
        old: dataKeluarga.find((item) => item.id === selectedData)?.nama,
      };

    if (data.nik !== dataKeluarga.find((item) => item.id === selectedData)?.nik)
      dataSanggah.nik = {
        new: data.nik,
        old: dataKeluarga.find((item) => item.id === selectedData)?.nik,
      };

    if (
      data.hubungan !==
      dataKeluarga.find((item) => item.id === selectedData)?.hubungan
    )
      dataSanggah.hubungan = {
        new: data.hubungan,
        old: dataKeluarga.find((item) => item.id === selectedData)?.hubungan,
      };

    if (
      data.tanggal_lahir !==
      dataKeluarga.find((item) => item.id === selectedData)?.tanggal_lahir
    )
      dataSanggah.tanggal_lahir = {
        new: data.tanggal_lahir,
        old: dataKeluarga.find((item) => item.id === selectedData)
          ?.tanggal_lahir,
      };

    if (
      data.pekerjaan !==
      dataKeluarga.find((item) => item.id === selectedData)?.pekerjaan
    )
      dataSanggah.pekerjaan = {
        new: data.pekerjaan,
        old: dataKeluarga.find((item) => item.id === selectedData)?.pekerjaan,
      };

    if (
      data.status !==
      dataKeluarga.find((item) => item.id === selectedData)?.status
    )
      dataSanggah.status = {
        new: data.status,
        old: dataKeluarga.find((item) => item.id === selectedData)?.status,
      };

    addRevisi({
      action: "edit",
      id: selectedData,
      nama: data.nama,
      data: dataSanggah,
      file: data.file as File,
      catatan: data.catatan,
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
    setSelectedData("");
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    addNotification({
      message: "Perubahan berhasil disimpan",
      title: "Edit keluarga",
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-2 p-4">
        <select
          name="status"
          className="select w-full border-base-content/20 bg-base-200 select-sm text-base-content focus:outline-none"
          required
          value={selectedData}
          onChange={(e) => setSelectedData(e.target.value)}
        >
          <option value="">Pilih Keluarga</option>
          {dataKeluarga
            .filter(
              (item) =>
                revisi
                  .filter((r) => r.action !== "add")
                  .some((r) => r.id === item.id) === false,
            )
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama} ({item.Ref.nama})
              </option>
            ))}
        </select>
      </div>
      {selectedData && (
        <>
          <div className="px-4">
            <div className="rounded-box bg-base-200 p-2 text-sm">
              <h1 className="font-bold">Current Data</h1>
              <p>
                NIK:{" "}
                {dataKeluarga.find((item) => item.id === selectedData)?.nik}
              </p>
              <p>
                Tanggal Lahir:{" "}
                {
                  dataKeluarga.find((item) => item.id === selectedData)
                    ?.tanggal_lahir
                }
              </p>
              <p>
                Pekerjaan:{" "}
                {
                  dataKeluarga.find((item) => item.id === selectedData)
                    ?.pekerjaan
                }
              </p>
              <p>
                Status:{" "}
                {snackToTitleCase(
                  dataKeluarga.find((item) => item.id === selectedData)
                    ?.status || "",
                )}
              </p>
            </div>
          </div>
          <form onSubmit={submitForm}>
            <div className="grid grid-cols-2 gap-1 px-4 pb-4">
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
                  onChange={(e) =>
                    setData({ ...data, hubungan: e.target.value })
                  }
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
                    {
                      validationErrors.find((e) => e.field === "hubungan")
                        ?.message
                    }
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
                  onChange={(e) =>
                    setData({ ...data, tanggal_lahir: e.target.value })
                  }
                />
                {validationErrors.find((e) => e.field === "tanggal_lahir") && (
                  <p className="label text-xs font-bold text-error">
                    {
                      validationErrors.find((e) => e.field === "tanggal_lahir")
                        ?.message
                    }
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
                  onChange={(e) =>
                    setData({ ...data, pekerjaan: e.target.value })
                  }
                />
                {validationErrors.find((e) => e.field === "pekerjaan") && (
                  <p className="label text-xs font-bold text-error">
                    {
                      validationErrors.find((e) => e.field === "pekerjaan")
                        ?.message
                    }
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
                    {
                      validationErrors.find((e) => e.field === "status")
                        ?.message
                    }
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
                  onChange={(e) =>
                    setData({ ...data, catatan: e.target.value })
                  }
                />
                {validationErrors.find((e) => e.field === "catatan") && (
                  <p className="label text-xs font-bold text-error">
                    {
                      validationErrors.find((e) => e.field === "catatan")
                        ?.message
                    }
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
                  onChange={(e) =>
                    setData({ ...data, file: e.target.files?.[0] ?? null })
                  }
                />
                {validationErrors.find((e) => e.field === "file") && (
                  <p className="label text-xs font-bold text-error">
                    {validationErrors.find((e) => e.field === "file")?.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="btn col-span-2 mt-4 btn-sm btn-accent"
              >
                Submit
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
