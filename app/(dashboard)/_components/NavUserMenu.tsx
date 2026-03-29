"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useSignout } from "@/hooks/use-signout";
import { User } from "@/lib/auth-client";
import { IconHome, IconLogout, IconSearch } from "@tabler/icons-react";
import Link from "next/link";

const NavUserMenu = ({ user }: { user: User }) => {
  const { isMobile } = useSidebar();
  const handleSignout = useSignout();

  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      side={isMobile ? "bottom" : "right"}
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={user.image ?? `https://avatar.vercel.sh/${user.email}`}
              alt={user.name ?? "User Avatar"}
            />
            <AvatarFallback className="rounded-lg">
              {user.name && user.name.length > 0
                ? user.name[0].toUpperCase()
                : user.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {user.name && user.name.length > 0
                ? user.name
                : user.email.split("@")[0]}
            </span>
            <span className="text-muted-foreground truncate text-xs">
              {user.email}
            </span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href="/">
            <IconHome />
            Home
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/search">
            <IconSearch />
            Search
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleSignout}>
        <IconLogout />
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default NavUserMenu;
