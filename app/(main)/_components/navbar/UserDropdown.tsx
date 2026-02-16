"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const UserDropdown = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleSignout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully!");
            router.replace("/");
          },
        },
      });
    } catch {
      toast.error("Failed to signout, Please try again");
    }
  };

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
          Go to Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() =>
            router.push(`/${session?.user.role}s/settings`, {
              scroll: false,
            })
          }
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignout}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
