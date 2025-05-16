"use client";
import AppLogo from "../Molecules/AppLogo";
import Link from "next/link";
import ProfileButton from "../Molecules/ProfileButton";
import { Menu, MenuButton, MenuItems, MenuItem } from "../Molecules/Dropdown";
import { useSession } from "@/lib/context/session";
import { ThemesContext } from "@/lib/context/themes";
import { useContext } from "react";
import SignOut from "../Molecules/SignOut";
export default function Header() {
  const { data: session } = useSession();
  const { openMenu } = useContext(ThemesContext);
  return (
    <nav className="shadow-neutral/50 bg-primary sticky top-0 left-0 z-30 h-16 w-full bg-linear-to-r from-0% via-30% shadow-md">
      <div className="container-xl mx-auto flex h-full items-center justify-between px-4">
        <div>
          <Link href="/">
            <AppLogo />
          </Link>
        </div>
        <div className="flex items-center gap-8">
          {session?.user && (
            <Menu>
              <MenuButton>
                <ProfileButton
                  src={session?.user?.gravatar || ""}
                  name={session?.user?.name || "-"}
                  nip={session?.user?.nip || "-"}
                />
              </MenuButton>
              <MenuItems className="bg-secondary text-secondary-content min-w-36">
                <div className="w-full">
                  <MenuItem
                    className="cursor-pointer"
                    onClick={openMenu}
                    icon="buffer"
                    showIcon={true}
                  >
                    <div>Themes</div>
                  </MenuItem>
                  <SignOut />
                </div>
              </MenuItems>
            </Menu>
          )}
        </div>
      </div>
    </nav>
  );
}
