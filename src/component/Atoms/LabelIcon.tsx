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
  LuX,
  LuPlus,
  LuFilePlus2,
  LuCircleCheck,
  LuCirclePlay,
  LuTrash2,
  LuCircleAlert,
  LuChevronsUpDown,
  LuCalendarDays,
  LuArrowLeft,
  LuKey,
  LuSquarePen,
  LuFile,
  LuSend,
  LuCreditCard,
  LuEye,
  LuFolderOpen,
  LuFolderSearch2,
  LuHistory,
  LuCircleX,
  LuReceipt,
  LuMap,
  LuUserCog,
  LuUsers,
  LuBuilding2,
  LuPlane,
  LuShip,
  LuBusFront,
  LuPackage,
  LuHeartHandshake,
  LuWallet,
  LuCar,
  LuArrowRightFromLine,
  LuKeyRound,
  LuGitFork,
  LuUser,
  LuServer,
  LuActivity,
} from "react-icons/lu";
import { FaPeopleArrows } from "react-icons/fa6";
import { BiReset } from "react-icons/bi";
import { cn } from "@/lib/utils";
type SvgProps = React.SVGAttributes<SVGSVGElement>;

export default function Icon({
  height = "100%",
  icon,
  className,
  ...props
}: {
  height: number | string;
  icon?: string;
} & SvgProps) {
  switch (icon) {
    case "LaptopMinimal":
      return (
        <LuLaptopMinimal
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Layers3":
      return (
        <LuLayers3
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Printer":
      return (
        <LuPrinter
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "FilePenLine":
      return (
        <LuFilePenLine
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "FileSpreadsheet":
      return (
        <LuFileSpreadsheet
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "ChevronRight":
      return (
        <LuChevronRight
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "MapPinCheck":
      return (
        <LuMapPinCheck
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "CloudUpload":
      return (
        <LuCloudUpload
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "LayoutDashboard":
      return (
        <LuLayoutDashboard
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Keyboard":
      return (
        <LuKeyboard
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Search":
      return (
        <LuSearch
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Archive":
      return (
        <LuArchive
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "FileSearch":
      return (
        <LuFileSearch2
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Coins":
      return (
        <LuCoins className={cn("w-full", className)} size={height} {...props} />
      );
      break;
    case "FileText":
      return (
        <LuFileText
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Upload":
      return (
        <LuUpload
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "ClipboardList":
      return (
        <LuClipboardList
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "FilePen":
      return (
        <LuFilePen
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Repeat":
      return (
        <LuRepeat
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "MessageCircleWarning":
      return (
        <LuMessageCircleWarning
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "FileBadge2":
      return (
        <LuFileBadge2
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "x":
      return (
        <LuX className={cn("w-full", className)} size={height} {...props} />
      );
      break;
    case "plus":
      return (
        <LuPlus className={cn("w-full", className)} size={height} {...props} />
      );
      break;
    case "FilePlus2":
      return (
        <LuFilePlus2
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "CircleCheck":
      return (
        <LuCircleCheck
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "CirclePlay":
      return (
        <LuCirclePlay
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Trash2":
      return (
        <LuTrash2
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "CircleAlert":
      return (
        <LuCircleAlert
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "ChevronsUpDown":
      return (
        <LuChevronsUpDown
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "CalendarDays":
      return (
        <LuCalendarDays
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "ArrowLeft":
      return (
        <LuArrowLeft
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Key":
      return (
        <LuKey className={cn("w-full", className)} size={height} {...props} />
      );
      break;
    case "SquarePen":
      return (
        <LuSquarePen
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "PeopleArrows":
      return (
        <FaPeopleArrows
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "File":
      return (
        <LuFile className={cn("w-full", className)} size={height} {...props} />
      );
      break;
    case "Send":
      return (
        <LuSend className={cn("w-full", className)} size={height} {...props} />
      );
      break;
    case "Users":
      return (
        <LuUsers className={cn("w-full", className)} size={height} {...props} />
      );
      break;
    case "CreditCard":
      return (
        <LuCreditCard
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Receipt":
      return (
        <LuReceipt
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Reset":
      return (
        <BiReset className={cn("w-full", className)} size={height} {...props} />
      );
      break;
    case "Eye":
      return (
        <LuEye className={cn("w-full", className)} size={height} {...props} />
      );
      break;
    case "FolderOpen":
      return (
        <LuFolderOpen
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "FolderSearch2":
      return (
        <LuFolderSearch2
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "History":
      return (
        <LuHistory
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "CircleX":
      return (
        <LuCircleX
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Map":
      return (
        <LuMap className={cn("w-full", className)} size={height} {...props} />
      );
      break;
    case "UserCog":
      return (
        <LuUserCog
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Building":
      return (
        <LuBuilding2
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Plane":
      return (
        <LuPlane className={cn("w-full", className)} size={height} {...props} />
      );
      break;
    case "Ship":
      return (
        <LuShip className={cn("w-full", className)} size={height} {...props} />
      );
      break;
    case "Bus":
      return (
        <LuBusFront
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Package":
      return (
        <LuPackage
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "HeartHandshake":
      return (
        <LuHeartHandshake
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Wallet":
      return (
        <LuWallet
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Car":
      return (
        <LuCar className={cn("w-full", className)} size={height} {...props} />
      );
      break;
    case "ArrowRightFromLine":
      return (
        <LuArrowRightFromLine
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "KeyRound":
      return (
        <LuKeyRound
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "GitFork":
      return (
        <LuGitFork
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "User":
      return (
        <LuUser className={cn("w-full", className)} size={height} {...props} />
      );
      break;
    case "Server":
      return (
        <LuServer
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    case "Activity":
      return (
        <LuActivity
          className={cn("w-full", className)}
          size={height}
          {...props}
        />
      );
      break;
    default:
      break;
  }
}
