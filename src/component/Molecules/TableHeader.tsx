// components/molecules/TableHeader.tsx
type TableHeaderProps = {
    columns: string[];
  };
  
  export const TableHeader = ({ columns }: TableHeaderProps) => (
    <thead>
      <tr className="sticky top-0 bg-primary-100">
        {columns.map((col) => (
          <th key={col} className="px-4 py-2 text-left text-sm font-semibold text-primary-700">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
  