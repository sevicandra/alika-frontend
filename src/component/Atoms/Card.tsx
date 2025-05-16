export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-primary hover:bg-primary-700 flex aspect-square w-50 cursor-pointer items-center justify-center rounded-md p-10 hover:drop-shadow-sm">
      {children}
    </div>
  );
}
