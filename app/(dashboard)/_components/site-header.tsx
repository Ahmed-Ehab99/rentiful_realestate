"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {session?.user.role === "manager" ? (
            <>Manager View</>
          ) : (
            <>Renter View</>
          )}
        </h1>
        {isPending ? (
          <Skeleton className="ml-auto h-9 w-43.5" />
        ) : (
          <Button
            variant="secondary"
            className="bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50 ml-auto"
            onClick={() =>
              router.push(
                session?.user.role === "manager"
                  ? "/managers/newproperty"
                  : "/search",
              )
            }
          >
            {session?.user.role === "manager" ? (
              <>
                <Plus className="h-4 w-4" />
                <span className="ml-2 hidden md:block">Add New Property</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span className="ml-2 hidden md:block">Search Properties</span>
              </>
            )}
          </Button>
        )}
      </div>
    </header>
  );
}
