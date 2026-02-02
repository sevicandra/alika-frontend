import Link from "next/link";
import { LuGhost } from "react-icons/lu";

export default function NotFoundPage() {
  return (
    <div className="flex h-full items-center justify-center bg-linear-to-tr from-primary-300 via-secondary-300 to-accent-300 px-4">
      <div className="w-full max-w-md rounded-2xl bg-neutral p-10 text-center shadow-xl">
        <div className="mb-6 flex justify-center">
          <LuGhost className="h-20 w-20 text-accent-500" />
        </div>
        <h1 className="mb-4 text-5xl font-bold text-neutral-content">404</h1>
        <p className="mb-6 text-lg text-neutral-content">
          Wah, halaman yang kamu cari tidak ditemukan.
        </p>
        <Link
          href="/penghasilan/rincian"
          className="inline-block rounded-full bg-primary-500 px-6 py-2 text-primary-content shadow transition hover:bg-primary-600"
        >
          Kembali
        </Link>
      </div>
    </div>
  );
}
