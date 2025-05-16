import Card from "../Atoms/Card";
// import Label from "../Atoms/Label";
import Link from "next/link";
export default function MainModuleCard({
  children,
  label,
  href,
}: {
  children: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <div>
      <Link href={href}>
        <Card>{children}</Card>
        <span className="text-center">
        <h1>{label}</h1>
        </span>
      </Link>
    </div>
  );
}
