// components/molecules/TableHeader.tsx
type TableHeaderProps = {
  columns: string[];
};

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;
export const TableHeader = ({
  columns,
  className,
}: TableRowProps & TableHeaderProps) => (
  <thead>
    <tr className={`sticky top-0 border-0 bg-primary-100 ${className} z-1`}>
      {columns.map((col, index) => (
        <th
          key={index}
          className="px-4 py-2 text-left text-sm font-semibold text-primary-700"
        >
          {col}
        </th>
      ))}
    </tr>
  </thead>
);
