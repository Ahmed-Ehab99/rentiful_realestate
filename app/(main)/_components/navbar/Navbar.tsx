"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import AuthBtns from "./AuthBtns";
import UserDropdown from "./UserDropdown";

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className={`fixed top-0 left-0 z-50 h-12.5 w-full shadow-xl`}>
      <header className="bg-primary-700 flex w-full items-center justify-between px-8 py-3 text-white">
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

        <p className="text-primary-200 hidden md:block">
          Discover your rental apartment with our advanced search
        </p>

        {isPending ? (
          <Skeleton className="size-8 rounded-full" />
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
