"use client";
import List from "../Atoms/List";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItemBase = {
  name: string;
  icon?: React.ReactNode;
};

type MenuItemWithUrl = MenuItemBase & {
  url: string;
  sub?: never; // Tidak boleh memiliki `sub`
};

type MenuItemWithSub = MenuItemBase & {
  sub: MenuItem[];
  url?: never; // Tidak boleh memiliki `url`
};

type MenuItem = MenuItemWithUrl | MenuItemWithSub;

export type Menu = MenuItem[];

export default function MenuCard({ menu }: { menu: Menu[] }) {
  const pathname = usePathname();
  const list = (menu: MenuItem[]) => {
    return menu.map((item) => {
      if (item.sub) {
        return (
          <List.Parent key={item.name} summary={item.name}>
            <div className="flex items-center gap-4">
              {item.icon}
              <span>{item.name}</span>
            </div>
            <List>{list(item.sub)}</List>
          </List.Parent>
        );
      }
      return (
        <List.Item key={item.name}>
          {item.url ? (
            <Link
              href={item.url}
              className={`hover:bg-accent-300/20 ${
                pathname.startsWith(item.url) && "bg-accent text-accent-content"
              }`}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              {item.icon}
              <span>{item.name}</span>
            </div>
          )}
        </List.Item>
      );
    });
  };

  return (
    <div className="flex min-h-full flex-col gap-2 rounded-t-md bg-base-200 px-2 py-4 text-sm text-base-content drop-shadow-sm *:not-last:after:h-1 *:not-last:after:w-full *:not-last:after:grow *:not-last:after:bg-base-300 *:not-last:after:content-['']">
      {menu.map((item, index) => {
        return (
          <List key={index}>
            {item.map((item) => {
              if (item.sub) {
                return (
                  <List.Parent key={item.name} summary={item.name}>
                    {list(item.sub)}
                  </List.Parent>
                );
              }
              return (
                <List.Item key={item.name}>
                  {item.url ? (
                    <Link
                      href={item.url}
                      className={`hover:bg-accent-300/20 ${
                        pathname.startsWith(item.url) &&
                        "bg-accent text-accent-content"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-4">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  )}
                </List.Item>
              );
            })}
          </List>
        );
      })}
    </div>
  );
}
