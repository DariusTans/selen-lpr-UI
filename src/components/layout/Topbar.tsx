import { Bell, ChevronDown, LogOut, Menu, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 text-primary-foreground shadow">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-md p-2 transition-colors hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="size-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <img src="/selen-logo.png" alt="SELEN" className="size-9 rounded-md bg-white/95 object-contain p-0.5" />
          <span className="text-lg font-bold tracking-[0.3em]">SELEN</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-full p-2 transition-colors hover:bg-white/10" aria-label="Notifications">
          <Bell className="size-5" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-warning" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
              <span className="flex size-7 items-center justify-center rounded-full bg-destructive text-sm font-bold">
                C
              </span>
              <span className="hidden font-semibold sm:inline">Combine_user001</span>
              <ChevronDown className="size-4 opacity-80" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User /> โปรไฟล์
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings /> ตั้งค่า
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut /> ออกจากระบบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
