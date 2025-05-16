"use server";
import { Menu, Items, Item } from "../Molecules/Sidebar";
import { menus } from "@/lib/sidebar";

export default async function Sidebar({ menu }: { menu: string }) {
  const sidebar = await menus({ module: menu });
  return (
    <Menu>
      {sidebar.map((items, i) => (
        <Items key={i} title={items.title}>
          {items.data.map((item) => (
            <Item
              key={item.label}
              href={item.path}
              icon={item.icon}
            >
              {item.label}
            </Item>
          ))}
        </Items>
      ))}
    </Menu>
  );
}
