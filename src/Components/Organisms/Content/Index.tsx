import Footer from "@/Components/Organisms/Footer/Index";
import DesktopMenu from "../Desktop-menu/Index";
type ContentProps = {
    children?: React.ReactElement; 
    desktopMainMenu?: boolean;
};

const Content:React.FC<ContentProps> = ({children, desktopMainMenu}) => {
    return (
        <>
            <div className={`relative grow min-h-max flex`}>
                    <DesktopMenu
                        desktopMainMenu={desktopMainMenu}
                    >
                                        <>
                <DesktopMenu.Sub
                    title="Halaman Utama"
                >
                    <>
                        <DesktopMenu.Menu
                            href="/"
                        >
                            Beranda
                        </DesktopMenu.Menu>
                        <DesktopMenu.Menu
                            href="/"
                        >
                            Pengahsilan
                        </DesktopMenu.Menu>
                        <DesktopMenu.Menu
                            href="/"
                        >
                            Riwayat Cetak
                        </DesktopMenu.Menu>
                    </>
                </DesktopMenu.Sub>
                <DesktopMenu.Sub
                    title="Rincian"
                >
                    <>
                        <DesktopMenu.Menu
                            href="/"
                        >
                            Gaji
                        </DesktopMenu.Menu>
                        <DesktopMenu.Menu
                            href="/"
                        >
                            Uang Makan
                        </DesktopMenu.Menu>
                        <DesktopMenu.Menu
                            href="/"
                        >
                            Uang Lembur
                        </DesktopMenu.Menu>
                        <DesktopMenu.Menu
                            href="/"
                        >
                            Tunjangan Kinerja
                        </DesktopMenu.Menu>
                        <DesktopMenu.Menu
                            href="/"
                        >
                            Pembayaran Lainnya
                        </DesktopMenu.Menu>
                    </>
                </DesktopMenu.Sub>
                <DesktopMenu.Sub
                    title="Laporan"
                >
                    <>
                        <DesktopMenu.Menu
                            href="/"
                        >
                            PPh Pasal 21
                        </DesktopMenu.Menu>
                        <DesktopMenu.Menu
                            href="/"
                        >
                            PPh Pasal 21 Final
                        </DesktopMenu.Menu>
                        <DesktopMenu.Menu
                            href="/"
                        >
                            Penghasilan Tahunan
                        </DesktopMenu.Menu>
                        <DesktopMenu.Menu
                            href="/"
                        >
                            Dokumen Perubahan
                        </DesktopMenu.Menu>
                        <DesktopMenu.Menu
                            href="/"
                        >
                            Kolaborasi
                        </DesktopMenu.Menu>
                    </>
                </DesktopMenu.Sub>
                </>
                    </DesktopMenu>
                <div className="grow relative min-h-max flex flex-col">
                    <div className="grow p-4">
                        {children}
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default Content