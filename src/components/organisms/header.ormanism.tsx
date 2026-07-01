"use client";
import AppLogo from "@/components/molecules/app-logo.molecule";
import Link from "next/link";
import ProfileButton from "@/components/molecules/user-profile.molecule";
import {
  Menu,
  MenuButton,
  MenuItems,
} from "@/components/molecules/dropdown.molecule";
import { useSession } from "@/context/session";
import { ThemesContext } from "@/context/themes";
import { useContext } from "react";
import SignOut from "@/components/molecules/sign-out.molecule";
import { LuPalette } from "react-icons/lu";

export default function Header() {
  const { data: session } = useSession();
  const { openMenu } = useContext(ThemesContext);
  return (
    <nav className="sticky top-0 left-0 z-30 h-16 w-full border-b border-base-content/10 bg-base-200 shadow shadow-base-200">
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
              <MenuItems className="min-w-36 bg-secondary text-secondary-content">
                <div className="w-full">
                  <div
                    onClick={openMenu}
                    className="align-center grid cursor-pointer grid-cols-[50_auto] gap-2 py-2"
                  >
                    <span>
                      <LuPalette className="h-[25px] w-full" />
                    </span>
                    <span className="truncate text-left text-nowrap">
                      Themes
                    </span>
                  </div>
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
