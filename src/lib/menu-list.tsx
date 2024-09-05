import { Banknote, LayoutGrid, LucideIcon } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Estatistica",
          active: pathname === "/",
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/transactions",
          label: "Transações",
          active: pathname === "/transactions",
          icon: Banknote,
          submenus: [],
        },
      ],
    },
  ];
}
