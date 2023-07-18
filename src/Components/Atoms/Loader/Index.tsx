type LoaderProps = {
    color?: string;
    size?: string;
};

const Loader:React.FC<LoaderProps> = ({color = "#fff", size = "h-10 w-10", ...props}) => {
    return (
        <div className={`animate-spin ${size}`}>     
            <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144.21 144.21">
                <defs>
                    <linearGradient id="linear-gradient" x1="0" y1="72.11" x2="144.21" y2="72.11" gradientUnits="userSpaceOnUse">
                        <stop offset=".49" stopColor={color} stopOpacity="0"/>
                        <stop offset="1" stopColor={color}/>
                    </linearGradient>
                </defs>
                <g id="Layer_1-2" data-name="Layer 1">
                    <path fill="url(#linear-gradient)" className="cls-1" d="m72.1,0C32.28,0,0,32.28,0,72.1s32.28,72.11,72.1,72.11,72.11-32.28,72.11-72.11S111.92,0,72.1,0Zm0,122.38c-27.77,0-50.28-22.51-50.28-50.28s22.51-50.28,50.28-50.28,50.28,22.51,50.28,50.28-22.51,50.28-50.28,50.28Z"/>
                </g>
            </svg>
        </div>
    )
}

export default Loader