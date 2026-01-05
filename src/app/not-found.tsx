// pages/404.tsx
import Link from "next/link";
import { LuGhost } from "react-icons/lu";

export default function NotFoundPage() {
  return (
    <div className="from-primary-300 via-secondary-300 to-accent-300 flex h-full items-center justify-center bg-linear-to-tr px-4">
      <div className="bg-neutral w-full max-w-md rounded-2xl p-10 text-center shadow-xl">
        <div className="mb-6 flex justify-center">
          <LuGhost className="text-accent-500 h-20 w-20" />
        </div>
        <h1 className="text-neutral-content mb-4 text-5xl font-bold">404</h1>
        <p className="text-neutral-content mb-6 text-lg">
          Wah, halaman yang kamu cari tidak ditemukan.
        </p>
        <Link
          href="/"
          className="bg-primary-500 text-primary-content hover:bg-primary-600 inline-block rounded-full px-6 py-2 shadow transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
