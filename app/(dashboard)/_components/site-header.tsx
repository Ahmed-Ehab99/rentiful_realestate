import { getServerSession } from "@/app/data/get-session";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { unauthorized } from "next/navigation";

export async function SiteHeader() {
  const session = await getServerSession();
  const user = session?.user;
  if (!user) unauthorized();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {user.role === "manager" ? <>Manager View</> : <>Renter View</>}
        </h1>
        <Button
          variant="secondary"
          className="bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50 ml-auto"
          asChild
        >
          <Link
            href={user.role === "manager" ? "/managers/newProperty" : "/search"}
          >
            {user.role === "manager" ? (
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
          </Link>
        </Button>
      </div>
    </header>
  );
}
