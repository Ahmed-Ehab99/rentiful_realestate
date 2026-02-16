"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import UserDropdown from "./UserDropdown";
import AuthBtns from "./AuthBtns";

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  // const router = useRouter();
  // const pathname = usePathname();

  // const isDashboardPage =
  //   pathname.includes("/managers") || pathname.includes("/tenants");

  return (
    <div className={`fixed top-0 left-0 z-50 h-12.5 w-full shadow-xl`}>
      <header className="bg-primary-700 flex w-full items-center justify-between px-8 py-3 text-white">
        {/* Logo */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            scroll={false}
            className="hover:text-primary-300 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Rentiful Logo"
                width={24}
                height={24}
                className="size-6"
              />
              <div className="text-xl font-bold">
                RENT
                <span className="text-secondary-500 hover:text-primary-300 font-light">
                  IFUL
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* {isDashboardPage && session?.user ? (
          <Button
            variant="secondary"
            className="bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50 md:ml-4"
            onClick={() =>
              router.push(
                session.user.role === "manager"
                  ? "/managers/newproperty"
                  : "/search",
              )
            }
          >
            {session.user.role === "manager" ? (
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
        ) : ( */}
        <p className="text-primary-200 hidden md:block">
          Discover your rental apartment with our advanced search
        </p>
        {/* )} */}

        {isPending ? (
          <Skeleton className="size-9 rounded-full" />
        ) : session ? (
          <UserDropdown />
        ) : (
          <AuthBtns />
        )}
      </header>
    </div>
  );
};

export default Navbar;
