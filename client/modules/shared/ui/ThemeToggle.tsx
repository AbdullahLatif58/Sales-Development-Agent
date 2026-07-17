"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-lg
        border
        border-zinc-700
        bg-white
        text-zinc-900
        transition
        hover:bg-zinc-100
        dark:bg-zinc-900
        dark:text-white
        dark:hover:bg-zinc-800
      "
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}