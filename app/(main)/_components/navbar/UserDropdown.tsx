"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignout } from "@/hooks/use-signout";
import { User } from "@/lib/auth-client";
import { LayoutDashboard, LogOut, Settings, UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const UserDropdown = ({ user }: { user: User }) => {
  const router = useRouter();
  const handleSignout = useSignout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="outline">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={16}
              height={16}
              className="rounded-full object-cover"
            />
          ) : (
            <UserIcon className="text-foreground" />
          )}
          <span className="text-foreground max-w-48 truncate">
            {user.username || user.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {user.username || user.name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer font-bold"
          onClick={() =>
            router.push(
              user.role === "manager"
                ? "/managers/properties"
                : "/tenants/favorites",
              { scroll: false },
            )
          }
        >
          <LayoutDashboard />
          Go to Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() =>
            router.push(`/${user.role}s/settings`, {
              scroll: false,
            })
          }
        >
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignout}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
