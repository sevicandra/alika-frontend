"use client";
const Layout = ({
  gapok,
  tukin,
  umak,
  lembur,
  bulanan,

  tahun,
}: {
  gapok: React.ReactElement;
  tukin: React.ReactElement;
  umak: React.ReactElement;
  lembur: React.ReactElement;
  bulanan: React.ReactElement;
  tahun: React.ReactElement;
}) => {
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_auto_1fr_auto] gap-2 overflow-hidden">
      <div className="mx-4 mt-4 overflow-x-auto pr-4">
        <div className="flex min-w-max justify-start gap-1">{tahun}</div>
      </div>
      <div className="max-w-full overflow-x-auto px-4"></div>
      <div className="overflow-y-auto">
        <div className="flex flex-col gap-2 p-4">
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
            {gapok}
            {tukin}
            {umak}
            {lembur}
          </div>
          <div className="grid min-h-62 grid-rows-[auto_1fr] gap-2 overflow-hidden rounded-box bg-base-200 p-2">
            <div className="relative mb-2 after:absolute after:mt-2 after:w-full after:border-b after:border-base-300 after:content-['']">
              <h3 className="font-bold">Penghasilan Bulanan</h3>
            </div>
            {bulanan}
          </div>
          {/* <div className="grid grid-rows-[auto_1fr] gap-2 overflow-hidden rounded-box bg-base-200 p-2">
            <div className="relative mb-2 after:absolute after:mt-2 after:w-full after:border-b after:border-base-300 after:content-['']">
              <h3 className="font-bold">Dokumen Terbaru</h3>
            </div>
            {dokumen}
          </div> */}
        </div>
      </div>
      <div className="mx-4 mb-4 flex justify-between"></div>
    </div>
  );
};

export default Layout;
