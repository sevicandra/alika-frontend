import Link from "next/link"

type MobileMenu = {
    children?: React.ReactElement; 
};


type Navigation = {
    children: React.ReactElement; 
    label: string;
    href: string;
    color: string;
    basis: string;
};



const QuickMenu = ({children}:MobileMenu) => {
    return (
        <nav className="flex lg:hidden py-2 justify-start items-center sticky bottom-0 shadow w-full bg-primary ">
            {children}
        </nav>
    )
}

const Navigation = ({children, label, href, color, basis}:Navigation) => {
    return (
            <Link href={href} className={`${basis}`}>
                <div className={`flex flex-col justify-center items-center text-center ${color}`}>
                    {children}
                    <p>
                        {label}
                    </p>
                </div>
            </Link>
    )
}

QuickMenu.Navigation = Navigation 

export default QuickMenu