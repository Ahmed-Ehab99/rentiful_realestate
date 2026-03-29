import { getServerSession } from "@/app/data/get-session";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { unauthorized } from "next/navigation";
import NavMainMenu from "./NavMainMenu";

export async function NavMain() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <NavMainMenu user={user} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
