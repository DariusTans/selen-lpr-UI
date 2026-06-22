import { NavLink } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "./nav";
import { useTheme } from "@/hooks/useTheme";

interface SidebarProps {
  open: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const { theme, toggle } = useTheme();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 top-16 z-30 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <nav className="flex-1 space-y-6 overflow-y-auto p-3">
        {NAV_SECTIONS.map((section, i) => (
          <div key={i} className="space-y-1">
            {section.title && (
              <div className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </div>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                  )
                }
              >
                <item.icon className="size-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border p-4">
        <button
          onClick={toggle}
          className="flex items-center gap-3 text-sm font-medium text-primary"
          aria-label="Toggle theme"
        >
          <Sun className={cn("size-5", theme === "light" && "text-primary")} />
          <span
            className={cn(
              "relative inline-flex h-5 w-10 items-center rounded-full bg-secondary transition-colors",
              theme === "dark" && "bg-primary"
            )}
          >
            <span
              className={cn(
                "inline-block size-4 translate-x-0.5 rounded-full bg-card shadow transition-transform",
                theme === "dark" && "translate-x-5"
              )}
            />
          </span>
          <Moon className={cn("size-5", theme === "dark" && "text-primary")} />
        </button>

        <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          SELEN v0.1.0 • 0ea5033
        </span>
      </div>
    </aside>
  );
}
