import { getServerSession } from "@/app/data/get-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IconDotsVertical } from "@tabler/icons-react";
import { unauthorized } from "next/navigation";
import NavUserMenu from "./NavUserMenu";

export async function NavUser() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
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
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <NavUserMenu user={user} />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
