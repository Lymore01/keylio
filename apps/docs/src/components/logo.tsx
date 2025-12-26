"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

export default function Logo() {
  const { theme } = useTheme();
  return (
    <div className="flex items-center gap-2">
      <Image src={`/icon-${theme}.svg`} alt="Keylio" width={28} height={28} />
      <span className="font-semibold">Keylio</span>
    </div>
  );
}
