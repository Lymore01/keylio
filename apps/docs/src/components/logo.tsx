"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Logo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-[28px] w-[28px]" />
        <span className="font-semibold">Keylio</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Image
        src={`/icon-${resolvedTheme}.svg`}
        alt="Keylio"
        width={28}
        height={28}
      />
      <span className="font-semibold">Keylio</span>
    </div>
  );
}
