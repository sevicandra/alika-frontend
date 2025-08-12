"use client";
import { useTahun } from "@/context/penghasilan";
import Loading from "@/component/Molecules/Loading";
const Page = () => {
  const { tahun, setTahun, tahuns, loading } = useTahun();
  return (
    <div className="flex gap-2">
      {loading ? (
        <Loading direction="horizontal" />
      ) : (
        tahuns.map((item: any) => {
          return (
            <button
              onClick={() => setTahun(item.tahun)}
              key={item.tahun}
              className={`btn btn-outline btn-xs btn-secondary ${tahun == item.tahun ? "btn-active" : ""}`}
            >
              {item.tahun}
            </button>
          );
        })
      )}
    </div>
  );
};

export default Page;
