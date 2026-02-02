"use server";
import Link from "next/link";
const Layout = async ({
  children,
  tahun,
  action,
}: {
  children: React.ReactNode;
  tahun: React.ReactNode;
  action: React.ReactNode;
}) => {
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_auto_1fr_auto] gap-2 overflow-hidden">
      <div className="mx-4 mt-4 overflow-x-auto pr-4">
        <div className="flex min-w-max justify-start gap-1">{tahun}</div>
      </div>
      <div className="max-w-full overflow-x-auto px-4">
        <div className="flex min-w-max justify-end gap-1">
          <Link
            href="/penghasilan/rincian/gaji-pokok"
            className="btn btn-xs btn-success"
          >
            Gaji Pokok
          </Link>
          <Link
            href="/penghasilan/rincian/tunjangan-kinerja"
            className="btn btn-xs btn-success"
          >
            Tukin
          </Link>
          <Link
            href="/penghasilan/rincian/uang-makan"
            className="btn btn-xs btn-success"
          >
            Uang Makan
          </Link>
          <Link
            href="/penghasilan/rincian/uang-lembur"
            className="btn btn-xs btn-success"
          >
            Uang Lembur
          </Link>
          <Link
            href="/penghasilan/rincian/lain-lain"
            className="btn btn-xs btn-success"
          >
            Lain-Lain
          </Link>
        </div>
      </div>
      <>{children}</>
      <>{action}</>
      <div className="mx-4 mb-4 flex justify-between"></div>
    </div>
  );
};

export default Layout;
