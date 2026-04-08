"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "@/lib/auth-client";
import { IconBuilding, IconFileText, IconSettings } from "@tabler/icons-react";
import { FileText, Heart, Home, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavMainMenu = ({ user }: { user: User }) => {
  const pathname = usePathname();
  const userType = user.role;
  const navItems =
    userType === "manager"
      ? [
          {
            icon: IconBuilding,
            label: "Properties",
            href: "/managers/properties",
          },
          {
            icon: IconFileText,
            label: "Applications",
            href: "/managers/applications",
          },
          {
            icon: IconSettings,
            label: "Settings",
            href: "/managers/settings",
          },
        ]
      : [
          { icon: Heart, label: "Favorites", href: "/tenants/favorites" },
          {
            icon: FileText,
            label: "Applications",
            href: "/tenants/applications",
          },
          { icon: Home, label: "Residences", href: "/tenants/residences" },
          { icon: Settings, label: "Settings", href: "/tenants/settings" },
        ];

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton asChild tooltip={item.label} isActive={isActive}>
              <Link
                href={item.href}
                prefetch
                className="flex cursor-pointer items-center gap-4 p-1.5!"
              >
                {item.icon && (
                  <item.icon className="group-data-[collapsible=icon]:ml-1" />
                )}
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default NavMainMenu;
