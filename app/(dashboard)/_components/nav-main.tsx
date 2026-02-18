"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { IconBuilding, IconFileText, IconSettings } from "@tabler/icons-react";
import { FileText, Heart, Home, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const userType = session?.user.role;
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
          { icon: IconSettings, label: "Settings", href: "/managers/settings" },
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
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  isActive={isActive}
                >
                  <Link
                    href={item.href}
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
