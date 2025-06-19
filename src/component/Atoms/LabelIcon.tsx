import {
  LuLaptopMinimal,
  LuLayers3,
  LuPrinter,
  LuFilePenLine,
  LuChevronRight,
  LuMapPinCheck,
  LuFileSpreadsheet,
  LuCloudUpload,
  LuLayoutDashboard,
  LuKeyboard,
  LuSearch,
  LuArchive,
  LuFileSearch2,
  LuCoins,
  LuFileText,
  LuUpload,
  LuClipboardList,
  LuFilePen,
  LuRepeat,
  LuMessageCircleWarning,
  LuFileBadge2,
} from "react-icons/lu";
export default function Icon({
  width = "100%",
  height = "100%",
  icon,
}: {
  width?: number | string;
  height: number | string;
  icon?: string;
}) {
  switch (icon) {
    case "LaptopMinimal":
      return <LuLaptopMinimal className="w-full" size={height} />;
      break;
    case "Layers3":
      return <LuLayers3 className="w-full" size={height} />;
      break;
    case "Printer":
      return <LuPrinter className="w-full" size={height} />;
      break;
    case "FilePenLine":
      return <LuFilePenLine className="w-full" size={height} />;
      break;
    case "FileSpreadsheet":
      return <LuFileSpreadsheet className="w-full" size={height} />;
      break;
    case "ChevronRight":
      return <LuChevronRight className="w-full" size={height} />;
      break;
    case "MapPinCheck":
      return <LuMapPinCheck className="w-full" size={height} />;
      break;
    case "CloudUpload":
      return <LuCloudUpload className="w-full" size={height} />;
      break;
    case "LayoutDashboard":
      return <LuLayoutDashboard className="w-full" size={height} />;
      break;
    case "Keyboard":
      return <LuKeyboard className="w-full" size={height} />;
      break;
    case "Search":
      return <LuSearch className="w-full" size={height} />;
      break;
    case "Archive":
      return <LuArchive className="w-full" size={height} />;
      break;
    case "FileSearch":
      return <LuFileSearch2 className="w-full" size={height} />;
      break;
    case "Coins":
      return <LuCoins className="w-full" size={height} />;
      break;
    case "FileText":
      return <LuFileText className="w-full" size={height} />;
      break;
    case "Upload":
      return <LuUpload className="w-full" size={height} />;
      break;
    case "ClipboardList":
      return <LuClipboardList className="w-full" size={height} />;
      break;
    case "FilePen":
      return <LuFilePen className="w-full" size={height} />;
      break;
    case "Repeat":
      return <LuRepeat className="w-full" size={height} />;
      break;
    case "MessageCircleWarning":
      return <LuMessageCircleWarning className="w-full" size={height} />;
      break;
    case "FileBadge2":
      return <LuFileBadge2 className="w-full" size={height} />;
      break;
    default:
      break;
  }
}
