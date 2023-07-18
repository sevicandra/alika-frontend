import { Transition } from "@headlessui/react"
import Link from "next/link";

type DesktopMenu = {
    DesktopMenu?: boolean;
    children?: React.ReactElement;
    desktopMainMenu?: boolean;
};

type Sub = {
    children?: React.ReactElement;
    title?:string;
}

type Menu = {
    children?: string;
    href?: any;
    setMainMenu?:any
}

const DesktopMenu = ({desktopMainMenu = true,children}:DesktopMenu) => {
    return (
        <Transition
            show={desktopMainMenu}
            enter="transition-transform duration-300 delay-75"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform duration-300 delay-75"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
            className={`w-64 p-2 bg-base-100 hidden lg:block bg-primary-100 relative shadow shadow-primary-100 border-r shadow-lg z-10`}
        >
            <div
                className="sticky top-20"
            >
                {children}
            </div>
        </Transition>
    )
}

const Sub = ({title, children}:Sub) => {
    return (
        <div
            className="text-info"
        >
            <div className="font-bold">
                <h2>{title}</h2>
            </div>
            <div className="px-4">
                {children}
            </div>
        </div>
    )
}

const Menu = ({children, href, setMainMenu}:Menu) => {
    return (
        <div>
            <Link href={href} onClick={() => setMainMenu(false)}>{children}</Link>
        </div>
    )
}

DesktopMenu.Sub = Sub
DesktopMenu.Menu = Menu

export default DesktopMenu