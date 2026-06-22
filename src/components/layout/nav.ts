import {
  LayoutDashboard,
  ScrollText,
  PhoneCall,
  Siren,
  CarFront,
  ListChecks,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { to: "/", label: "AI Event Log", icon: ScrollText },
      { to: "/alarmbox-call", label: "Alarmbox Call Log", icon: PhoneCall },
      { to: "/alarmbox-event", label: "Alarmbox Event Log", icon: Siren },
    ],
  },
  {
    title: "LPR",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/vehicles", label: "รายการรถ Blacklist / VIP", icon: ListChecks },
      { to: "/vehicles/new", label: "เพิ่มรถ (Pre-register)", icon: CarFront },
    ],
  },
];
