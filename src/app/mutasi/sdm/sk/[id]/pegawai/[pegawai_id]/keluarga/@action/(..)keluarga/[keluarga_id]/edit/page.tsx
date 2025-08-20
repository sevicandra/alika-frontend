"use client";
import { useEffect, useState, use } from "react";
import { useKelaurga } from "@/context/mutasi/sdm";
import { useNotification } from "@/context/notifikasi";
import { useRouter } from "next/navigation";
import Loading from "@/component/Molecules/Loading";
import Icon from "@/component/Atoms/LabelIcon";

export default function Page({
  params,
}: {
  params: Promise<{ id: string; pegawai_id: string; keluarga_id: string }>;
}) {
  const router = useRouter();
  const { id, pegawai_id, keluarga_id } = use(params);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();
  const { setRefresh } = useKelaurga();
  const [hubungan, setHubungan] = useState<
    {
      kode: string;
      nama: string;
      jenis: string;
    }[]
  >([]);
  const [validationErrors, setValidationErrors] = useState<
    {
      field: string | null;
      message: string;
    }[]
  >([]);
  const getValidationError = (field: string) => {
    return validationErrors.find((e) => e.field === field);
  };
  const [data, setData] = useState<{
    nama: string;
    nik: string;
    hubungan: string;
    tanggal_lahir: string;
    pekerjaan: string;
    status: string;
  }>({
    nama: "",
    nik: "",
    tanggal_lahir: "",
    pekerjaan: "",
    hubungan: "",
    status: "",
  });
  useEffect(() => {
    const fetchRef = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/Mutasi/Referensi/HubunganKeluarga");
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message);
        }
        const { data } = await res.json();
        setHubungan(data);
      } catch (error) {
        addNotification({
          title: `Referensi Hubungan Keluarga`,
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRef();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Keluarga/${keluarga_id}`,
          {
            method: "GET",
          },
        );
        if (!res.ok) {
          const { message, errors } = await res.json();
          if (res.status === 422) {
            setValidationErrors(errors);
          }
          throw new Error(message);
        }
        const { data } = await res.json();
        console.log(data);

        setData({
          nama: data.nama,
          nik: data.nik || "",
          hubungan: data.hubungan,
          tanggal_lahir: data.tanggal_lahir,
          pekerjaan: data.pekerjaan,
          status: data.status,
        });
      } catch (error) {
        addNotification({
          title: `Data Keluarga`,
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/Mutasi/SDM/SuratKeputusan/${id}/Pegawai/${pegawai_id}/Keluarga/${keluarga_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": await fetch("/api/auth/csrf").then(async (res) => {
              const data = await res.json();
              return data.token;
            }),
          },
          method: "PATCH",
          body: JSON.stringify({
            nama: data.nama || "",
            nik: data.nik || "",
            hubungan: data.hubungan || "",
            tanggal_lahir: data.tanggal_lahir || "",
            pekerjaan: data.pekerjaan || "",
            status: data.status || "",
          }),
        },
      );
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }
      addNotification({
        title: "Data Keluarga",
        message: "Data Keluarga berhasil diubah",
      });
      router.back();
      setRefresh();
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        title: "Data Keluarga",
        variant: "error",
      });
    }
  }

  return (
    // <>
    //   {loading && (
    //     <div className="text-primary-600 absolute z-10 flex h-full w-full">
    //       <Loading />
    //     </div>
    //   )}
    //   <form onSubmit={submitForm}>
    //     <fieldset className="fieldset px-2 py-4">
    //       <label className="label text-base-content">Nama:</label>
    //       <input
    //         type="text"
    //         className={`input input-sm focus:outline-none w-full bg-base-300 ${validationErrors.find((e) => e.field === "nama") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
    //         placeholder="Type here"
    //         name="nama"
    //         required
    //         autoComplete="off"
    //         value={data.nama}
    //         onChange={(e) => setData({ ...data, nama: e.target.value })}
    //       />
    //       {validationErrors.find((e) => e.field === "nama") && (
    //         <p className="text-error label font-bold">
    //           {validationErrors.find((e) => e.field === "nama")?.message}
    //         </p>
    //       )}

    //       <label className="label text-base-content">NIK:</label>
    //       <input
    //         type="text"
    //         className={`input input-sm focus:outline-none w-full bg-base-300 ${validationErrors.find((e) => e.field === "nik") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
    //         placeholder="Type here"
    //         name="nik"
    //         autoComplete="off"
    //         value={data.nik}
    //         onChange={(e) => setData({ ...data, nik: e.target.value })}
    //       />
    //       {validationErrors.find((e) => e.field === "nik") && (
    //         <p className="text-error label font-bold">
    //           {validationErrors.find((e) => e.field === "nik")?.message}
    //         </p>
    //       )}

    //       <label className="label text-base-content">Hubungan:</label>
    //       <select
    //         name="hubungan"
    //         className={`select select-sm focus:outline-none w-full bg-base-300 ${validationErrors.find((e) => e.field === "hubungan") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
    //         required
    //         value={data.hubungan}
    //         onChange={(e) => setData({ ...data, hubungan: e.target.value })}
    //       >
    //         <option disabled={true} value={""}>
    //           Hubungan
    //         </option>
    //         {hubungan.map((item) => (
    //           <option key={item.kode} value={item.kode}>
    //             {item.nama}
    //           </option>
    //         ))}
    //       </select>
    //       {validationErrors.find((e) => e.field === "hubungan") && (
    //         <p className="text-error label font-bold">
    //           {validationErrors.find((e) => e.field === "hubungan")?.message}
    //         </p>
    //       )}

    //       <label className="label text-base-content">Tanggal Lahir:</label>
    //       <input
    //         type="date"
    //         className={`input input-sm focus:outline-none w-full bg-base-300 ${validationErrors.find((e) => e.field === "tanggal_lahir") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
    //         placeholder="Type here"
    //         name="tanggal_lahir"
    //         autoComplete="off"
    //         required
    //         value={data.tanggal_lahir}
    //         onChange={(e) =>
    //           setData({ ...data, tanggal_lahir: e.target.value })
    //         }
    //       />
    //       {validationErrors.find((e) => e.field === "tanggal_lahir") && (
    //         <p className="text-error label font-bold">
    //           {
    //             validationErrors.find((e) => e.field === "tanggal_lahir")
    //               ?.message
    //           }
    //         </p>
    //       )}

    //       <label className="label text-base-content">Pekerjaan:</label>
    //       <input
    //         type="text"
    //         className={`input input-sm focus:outline-none w-full bg-base-300 ${validationErrors.find((e) => e.field === "pekerjaan") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
    //         placeholder="Type here"
    //         name="pekerjaan"
    //         autoComplete="off"
    //         required
    //         value={data.pekerjaan}
    //         onChange={(e) => setData({ ...data, pekerjaan: e.target.value })}
    //       />
    //       {validationErrors.find((e) => e.field === "pekerjaan") && (
    //         <p className="text-error label font-bold">
    //           {validationErrors.find((e) => e.field === "pekerjaan")?.message}
    //         </p>
    //       )}

    //       <label className="label text-base-content">
    //         Status Tanggungan:
    //       </label>
    //       <select
    //         name="status"
    //         className={`select select-sm focus:outline-none w-full bg-base-300 ${validationErrors.find((e) => e.field === "status") ? "border-error text-error" : "border-base-content/20 text-base-content"}`}
    //         required
    //         value={data.status}
    //         onChange={(e) => setData({ ...data, status: e.target.value })}
    //       >
    //         <option disabled={true} value={""}>
    //           Status Tanggungan
    //         </option>
    //         <option value="TIDAK_TERTANGGUNG">TIDAK TERTANGGUNG</option>
    //         <option value="TERTANGGUNG">TERTANGGUNG</option>
    //       </select>
    //       {validationErrors.find((e) => e.field === "status") && (
    //         <p className="text-error label font-bold">
    //           {validationErrors.find((e) => e.field === "status")?.message}
    //         </p>
    //       )}

    //       <button type="submit" className="btn btn-sm mt-4 btn-accent">
    //         Submit
    //       </button>
    //     </fieldset>
    //   </form>
    // </>
    <form onSubmit={submitForm} noValidate>
      {loading && (
        <div className="absolute z-10 flex h-full w-full text-primary-600">
          <Loading />
        </div>
      )}
      <div className="bg-base-100 shadow-xl">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            {/* --- Field Nama --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nama</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="FileText" height={20} />
                </span>
                <input
                  type="text"
                  name="nama"
                  className={`input-bordered input w-full pl-10 ${getValidationError("nama") ? "input-error" : ""}`}
                  required
                  value={data.nama}
                  onChange={(e) => setData({ ...data, nama: e.target.value })}
                />
              </div>
              {getValidationError("nama") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("nama")?.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- Field NIK --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">NIK</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="FileText" height={20} />
                </span>
                <input
                  type="text"
                  name="nik"
                  className={`input-bordered input w-full pl-10 ${getValidationError("nik") ? "input-error" : ""}`}
                  required
                  value={data.nik}
                  onChange={(e) => setData({ ...data, nik: e.target.value })}
                />
              </div>
              {getValidationError("nik") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("nik")?.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- Field Hubungan --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Hubungan</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="ChevronsUpDown" height={20} />
                </span>
                <select
                  name="hubungan"
                  className={`select-bordered select w-full pl-10 ${getValidationError("hubungan") ? "select-error" : ""}`}
                  required
                  onChange={(e) =>
                    setData({ ...data, hubungan: e.target.value })
                  }
                  value={data.hubungan}
                >
                  <option disabled={true} value="">
                    Hubungan
                  </option>
                  {hubungan.map((item) => (
                    <option key={item.kode} value={item.kode}>
                      {item.nama}
                    </option>
                  ))}
                </select>
              </div>
              {getValidationError("golongan") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("golongan")?.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- Field Status --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Status Tanggungan
                </span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="ChevronsUpDown" height={20} />
                </span>
                <select
                  name="status"
                  className={`select-bordered select w-full pl-10 ${getValidationError("status") ? "select-error" : ""}`}
                  required
                  onChange={(e) => setData({ ...data, status: e.target.value })}
                  value={data.status}
                >
                  <option disabled={true} value={""}>
                    Status Tanggungan
                  </option>
                  <option value="TIDAK_TERTANGGUNG">TIDAK TERTANGGUNG</option>
                  <option value="TERTANGGUNG">TERTANGGUNG</option>
                </select>
              </div>
              {getValidationError("status") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("status")?.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- Field Tanggal Lahir --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Tanggal Lahir</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="CalendarDays" height={20} />
                </span>
                <input
                  name="tanggal_lahir"
                  type="date"
                  className={`input-bordered input w-full pl-10 ${getValidationError("tanggal_lahir") ? "input-error" : ""}`}
                  value={data.tanggal_lahir}
                  onChange={(e) =>
                    setData({ ...data, tanggal_lahir: e.target.value })
                  }
                />
              </div>
              {getValidationError("tanggal") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("tanggal")?.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- Field Pekerjaan --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Pekerjaan</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-base-content/50">
                  <Icon icon="FileText" height={20} />
                </span>
                <input
                  type="text"
                  name="pekerjaan"
                  className={`input-bordered input w-full pl-10 ${getValidationError("pekerjaan") ? "input-error" : ""}`}
                  required
                  value={data.pekerjaan}
                  onChange={(e) =>
                    setData({ ...data, pekerjaan: e.target.value })
                  }
                />
              </div>
              {getValidationError("pekerjaan") && (
                <label className="label">
                  <span className="label-text-alt flex items-center gap-1 text-error">
                    <Icon icon="CircleAlert" height={16} />{" "}
                    {getValidationError("pekerjaan")?.message}
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 bg-base-200/50 px-8 py-4">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => router.back()}
          >
            <Icon icon="ArrowLeft" height={16} /> Batal
          </button>
          <button type="submit" className="btn text-nowrap btn-primary">
            <Icon icon="FileText" height={16} /> Ubah Keluarga
          </button>
        </div>
      </div>
    </form>
  );
}
