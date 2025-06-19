export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-full max-h-full grid-rows-[auto_1fr] gap-2 overflow-hidden p-4">
      <div className="overflow-x-auto overflow-y-hidden grid grid-cols-1 md:grid-cols-2 gap-2 *:grid *:grid-cols-[120px_auto_1fr] *:gap-2 px-4 py-2">
        <div>
          <span>Nama</span>
          <span>:</span>
          <span>John Doe</span>
        </div>
        <div>
          <span>NIP</span>
          <span>:</span>
          <span>11213121412541</span>
        </div>
        <div>
          <span>Pangkat Golongan</span>
          <span>:</span>
          <span>11213121412541</span>
        </div>
        <div>
          <span>Kantor Asal</span>
          <span>:</span>
          <span>11213121412541</span>
        </div>
        <div>
          <span>Kantor Tujuan</span>
          <span>:</span>
          <span>11213121412541</span>
        </div>
      </div>
      {children}
    </div>
  );
}
