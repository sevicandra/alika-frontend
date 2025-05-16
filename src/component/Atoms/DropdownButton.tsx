import { useContext } from "react";
import { MenuContext } from "./DropdownMenu";

function MenuButton({ children }: { children: React.ReactNode }) {
  const { buttonRef, openMenu } = useContext(MenuContext);
  return (
    <button ref={buttonRef} onClick={openMenu} className="w-full">
      {children}
    </button>
  );
}


export default MenuButton