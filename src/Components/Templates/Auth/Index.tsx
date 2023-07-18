import Header from "@/Components/Organisms/Header/Index";
import Content  from "@/Components/Organisms/Content/Index";
import QuickMenu from "@/Components/Organisms/Mobile-menu/QuickMenu";
import MainMenu from "@/Components/Organisms/Mobile-menu/MainMenu";
import {Home, Printer, CreditCard} from "react-feather"
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

type Auth = {
    children?: React.ReactElement; 
};
const Auth = ({children}:Auth) => {
    const [mobileMainMenu, setMobileMainMenu] = useState(false)
    const [desktopMainMenu, setDesktopMainMenu] = useState(true)
    const { data: session } = useSession();

    useEffect(() => {
      if (session?.error === "Token Expired") {
        signOut();
      }
    }, [session]);
    return (
        <>
            <Header 
                setMobileMainMenu={setMobileMainMenu}
                setDesktopMainMenu={setDesktopMainMenu}
                desktopMainMenu={desktopMainMenu}
            />
            <Content
                desktopMainMenu={desktopMainMenu}
            >
                <>
                    {children}
                </>
            </Content>
            <QuickMenu>
                <>
                <QuickMenu.Navigation
                    label="Beranda"
                    href="/"
                    color="text-base-100"
                    basis="basis-1/3"
                >
                    <Home size={24}/>
                </QuickMenu.Navigation>
                <QuickMenu.Navigation
                    label="Penghasilan"
                    href="/"
                    color="text-base-100"
                    basis="basis-1/3"
                >
                    <CreditCard size={24}/>
                </QuickMenu.Navigation>
                <QuickMenu.Navigation
                    label="Cetak"
                    href="/"
                    color="text-base-100"
                    basis="basis-1/3"
                >
                    <Printer size={24}/>
                </QuickMenu.Navigation>
                </>
            </QuickMenu>
            <MainMenu 
                mobileMainMenu={mobileMainMenu}
                setMobileMainMenu={setMobileMainMenu}
                image={session?.user?.image}
                name={session?.user?.name}
                nip={session?.user?.nip}
            >
                <>
                <MainMenu.Sub
                    title="Halaman Utama"
                >
                    <>
                        <MainMenu.Menu
                            setMobileMainMenu={setMobileMainMenu}
                            href="/"
                        >
                            Beranda
                        </MainMenu.Menu>
                        <MainMenu.Menu
                            setMobileMainMenu={setMobileMainMenu}
                            href="/"
                        >
                            Pengahsilan
                        </MainMenu.Menu>
                        <MainMenu.Menu
                            setMobileMainMenu={setMobileMainMenu}
                            href="/"
                        >
                            Riwayat Cetak
                        </MainMenu.Menu>
                    </>
                </MainMenu.Sub>
                <MainMenu.Sub
                    title="Rincian"
                >
                    <>
                        <MainMenu.Menu
                            setMobileMainMenu={setMobileMainMenu}
                            href="/"
                        >
                            Gaji
                        </MainMenu.Menu>
                        <MainMenu.Menu
                            setMobileMainMenu={setMobileMainMenu}
                            href="/"
                        >
                            Uang Makan
                        </MainMenu.Menu>
                        <MainMenu.Menu
                            setMobileMainMenu={setMobileMainMenu}
                            href="/"
                        >
                            Uang Lembur
                        </MainMenu.Menu>
                        <MainMenu.Menu
                            setMobileMainMenu={setMobileMainMenu}
                            href="/"
                        >
                            Tunjangan Kinerja
                        </MainMenu.Menu>
                        <MainMenu.Menu
                            setMobileMainMenu={setMobileMainMenu}
                            href="/"
                        >
                            Pembayaran Lainnya
                        </MainMenu.Menu>
                    </>
                </MainMenu.Sub>
                <MainMenu.Sub
                    title="Laporan"
                >
                    <>
                        <MainMenu.Menu
                            setMobileMainMenu={setMobileMainMenu}
                            href="/"
                        >
                            PPh Pasal 21
                        </MainMenu.Menu>
                        <MainMenu.Menu
                            setMobileMainMenu={setMobileMainMenu}
                            href="/"
                        >
                            PPh Pasal 21 Final
                        </MainMenu.Menu>
                        <MainMenu.Menu
                            setMobileMainMenu={setMobileMainMenu}
                            href="/"
                        >
                            Penghasilan Tahunan
                        </MainMenu.Menu>
                        <MainMenu.Menu
                            setMobileMainMenu={setMobileMainMenu}
                            href="/"
                        >
                            Dokumen Perubahan
                        </MainMenu.Menu>
                        <MainMenu.Menu
                            setMobileMainMenu={setMobileMainMenu}
                            href="/"
                        >
                            Kolaborasi
                        </MainMenu.Menu>
                    </>
                </MainMenu.Sub>
                </>
            </MainMenu>
        </>
    )
}

export default Auth