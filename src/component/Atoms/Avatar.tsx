import Image from "next/image";

export default function Avatar({ src }: { src: string }) {
  return (
    <div className="avatar">
      <div className="w-9 rounded-full">
        <Image src={src} width={40} height={40} alt="avatar" />
      </div>
    </div>
  );
}
