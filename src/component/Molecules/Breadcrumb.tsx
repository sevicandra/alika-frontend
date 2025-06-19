type BreadcrumbProps<T> = {
  data: T[];
  renderRow: (row: T, index: number) => React.ReactNode;
};

export default function Breadcrumb<T>({ data, renderRow }: BreadcrumbProps<T>) {
  return (
    <div className="breadcrumbs text-sm">
      <ul>{data.map((row, index) => renderRow(row, index))}</ul>
    </div>
  );
}
