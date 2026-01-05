export default function List({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col">
      <ul className={`menu w-full max-w-full overflow-x-hidden `}>{children}</ul>
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

function ListParent({ children, summary }: { children: React.ReactNode; summary: string }) {
  return (
    <li>
      <details open>
        <summary>{summary}</summary>
        <ul>{children}</ul>
      </details>
    </li>
  );
}

List.Item = ListItem;
List.Parent = ListParent;
