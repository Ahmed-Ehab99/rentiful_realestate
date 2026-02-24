"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignout } from "@/hooks/use-signout";
import { authClient } from "@/lib/auth-client";
import { LayoutDashboard, LogOut, Search, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

const UserDropdown = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const handleSignout = useSignout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar>
          <AvatarImage
            src={session?.user.image || ""}
            alt={session?.user.name}
          />
          <AvatarFallback className="bg-primary-600 text-primary-50">
            {session?.user.name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {session?.user.name && session?.user.name.length > 0
              ? session?.user.name
              : session?.user.email.split("@")[0]}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {session?.user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer font-bold"
          onClick={() =>
            router.push(
              session?.user.role === "manager"
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
          onClick={() => {
            router.push("/search");
          }}
        >
          <Search />
          Search
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() =>
            router.push(`/${session?.user.role}s/settings`, {
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
