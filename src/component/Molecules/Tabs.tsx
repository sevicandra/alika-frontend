import { TabProvider } from "../Atoms/TabMenu";
import { TabButton, SelectButton } from "../Atoms/TabButton";
import { TabItem } from "../Atoms/TabItem";

type DataTabProps<T> = {
  tabs: string[];
  data: T[];
  renderTab: (tab: T, index: number) => React.ReactNode;
};

export function Tabs<T>({ tabs, data, renderTab }: DataTabProps<any>) {
  return (
    <TabProvider>
      <div>
        <span>
          <div className="hidden w-full gap-2 md:flex">
            <TabButton items={tabs} />
          </div>
          <div className="block p-2 md:hidden">
            <SelectButton options={tabs} />
          </div>
        </span>
      </div>
      {data.map((item, index) => renderTab(item, index))}
    </TabProvider>
  );
}

export const Item = TabItem;
