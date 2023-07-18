import {Menu, ChevronRight, LogOut} from "react-feather"
import {signOut} from "next-auth/react"

type HeaderProps = {
    setMobileMainMenu?: any;
    desktopMainMenu?: boolean;
    setDesktopMainMenu?: any;
};

const Header:React.FC<HeaderProps> = ({ setMobileMainMenu, desktopMainMenu, setDesktopMainMenu}) => {
    return (
        <header className="flex py-2 lg:py-0 px-4 lg:px-0 justify-between items-center lg:h-16 z-20 sticky top-0 shadow w-full bg-primary">
            <div
                className={`hidden lg:flex text-base-100 font-bold w-64 pl-4 justify-between items-center transition-colors duration-300 delay-75 ${desktopMainMenu ? "bg-primary-100" : "bg-primary"} h-full border-r`}
            >
                Alika
                <button 
                    onClick={() => setDesktopMainMenu(!desktopMainMenu)}
                    className="hidden lg:block border border-secondary hover:border-accent rounded p-1 text-accent hover:text-base-100 bg-secondary hover:bg-accent translate-x-1/2"
                >
                    <ChevronRight 
                        className={`transition ${ desktopMainMenu ? "rotate-180" : "" }`}
                    />
                </button>
            </div>

            <div
                className="lg:hidden text-base-100 font-bold lg:w-64 flex justify-between items-center"
            >
                Alika
            </div>

            <div
                className="lg:pr-4"
            >
                <button
                    className="hidden lg:block"
                    onClick={() => signOut()}
                >
                    <LogOut size={24} 
                    className="text-error"
                    />
                </button>
                <button
                    className="lg:hidden"
                    onClick={() => setMobileMainMenu(true)}
                >
                    <Menu
                        className="text-base-100"
                    />
                </button>
            </div>
        </header>
    );
}

export default Header