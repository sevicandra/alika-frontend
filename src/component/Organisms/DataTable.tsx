// components/organisms/DataTable.tsx
import { TableHeader } from "@/component/Molecules/TableHeader";
import { Text } from "@/component/Atoms/Text";

type DataTableProps<T> = {
  columns: string[];
  data: T[];
  renderRow: (row: T, index: number) => React.ReactNode;
};

export function DataTable<T>({ columns, data, renderRow }: DataTableProps<T>) {
  return (
    <table className="relative min-w-full divide-y divide-primary-200 text-sm">
      <TableHeader columns={columns} />
      <tbody className="divide-y divide-primary-100 bg-base-100">
        {data.length > 0 ? (
          data.map((row, i) => renderRow(row, i))
        ) : (
          <tr>
            <td
              colSpan={columns.length}
              className="p-4 text-center text-primary-500"
            >
              <Text>Data tidak ditemukan</Text>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
