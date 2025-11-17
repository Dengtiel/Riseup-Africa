"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { IconMoon, IconSun, IconDeviceDesktop } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <IconSun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          {theme === "light" ? (
            <IconSun className="h-4 w-4" />
          ) : theme === "dark" ? (
            <IconMoon className="h-4 w-4" />
          ) : (
            <IconDeviceDesktop className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <IconSun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <IconMoon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <IconDeviceDesktop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ThemeToggleSidebar() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="px-2 py-1.5">
      <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium">
        {theme === "light" ? (
          <IconSun className="h-4 w-4" />
        ) : theme === "dark" ? (
          <IconMoon className="h-4 w-4" />
        ) : (
          <IconDeviceDesktop className="h-4 w-4" />
        )}
        <span>Theme</span>
      </div>
      <div className="mt-1 space-y-1">
        <button
          onClick={() => setTheme("light")}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
        >
          <IconSun className="h-4 w-4" />
          <span>Light</span>
        </button>
        <button
          onClick={() => setTheme("dark")}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
        >
          <IconMoon className="h-4 w-4" />
          <span>Dark</span>
        </button>
        <button
          onClick={() => setTheme("system")}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
        >
          <IconDeviceDesktop className="h-4 w-4" />
          <span>System</span>
        </button>
      </div>
    </div>
  );
}

