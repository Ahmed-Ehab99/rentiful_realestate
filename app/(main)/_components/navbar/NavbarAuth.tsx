"use client";

import { authClient } from "@/lib/auth-client";
import AuthBtns from "./AuthBtns";
import UserDropdown from "./UserDropdown";

const NavbarAuth = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <span className="size-9" />;
  }

  if (session?.user) {
    return <UserDropdown user={session.user} />;
  }

  return <AuthBtns />;
};

export default NavbarAuth;
