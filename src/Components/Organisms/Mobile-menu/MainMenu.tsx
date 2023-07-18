import { Transition } from "@headlessui/react"
import Link from "next/link";
import { X } from "react-feather"
import { signOut } from "next-auth/react";
import Image from "next/image";

type MainMenu = {
    mobileMainMenu?: boolean;
    setMobileMainMenu?: any;
    image?: any;
    name?: string;
    nip?: string;
    children?: React.ReactElement;
};

type Sub = {
    children?: React.ReactElement;
    title?:string;
}

type Menu = {
    children?: string;
    href?: any;
    setMobileMainMenu?:any
}

const MainMenu = ({mobileMainMenu, setMobileMainMenu, image, name, nip, children}:MainMenu) => {

    return (
            <Transition
                show={mobileMainMenu}
                enter="transition-transform duration-300 delay-75"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transition-transform duration-300 delay-75"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
                className={`flex flex-col gap-2 px-4 py-4 bg-base-100 w-full min-h-screen z-50 fixed top-0 left-0 lg:hidden text-accent`}
            >
                <div 
                className="flex justify-between items-center w-full"
                >
                    <div className="flex gap-2">
                        <div className="rounded-full h-12 w-12 ring-2 ring-info overflow-hidden">
                            <Image  src={image} alt="avatar"
                                objectFit="fill"
                                width={48}
                                height={48}
                            />
                        </div>
                        <div>
                            <p>{name}</p>
                            <p>{nip}</p>
                        </div>
                    </div>
                    <button onClick={() => setMobileMainMenu(false)}>
                        <X size={24} />
                    </button>
                </div>
                <div 
                    className="h-[1px] bg-accent w-full"
                />
                <div
                    className="flex flex-col gap-2"
                >
                    {children}
                </div>
                <div 
                    className="h-[1px] bg-accent w-full"
                />
                <div>
                    <button
                        onClick={() => signOut()}
                        className="border border-primary hover:bg-primary px-4 rounded py-2 text-accent hover:text-white"
                    >
                        Sign Out
                    </button>

                </div>
            </Transition>
    )
}

const Sub = ({title, children}:Sub) => {
    return (
        <div>
            <div className="font-bold">
                <h2>{title}</h2>
            </div>
            <div className="px-4">
                {children}
            </div>
        </div>
    )
}

const Menu = ({children, href, setMobileMainMenu}:Menu) => {
    return (
        <div>
            <Link href={href} onClick={() => setMobileMainMenu(false)}>{children}</Link>
        </div>
    )
}

MainMenu.Menu = Menu
MainMenu.Sub = Sub
export default MainMenu