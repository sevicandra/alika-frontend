import icon from "../Atoms/Icon";

export default function AppLogo() {
  return (
    <div className="flex items-center gap-4 text-base-content drop-shadow-sm">
      <icon.Logo width={40} height={40} />
      <h1 className="text-2xl font-bold">ALIKA</h1>
    </div>
  );
}
