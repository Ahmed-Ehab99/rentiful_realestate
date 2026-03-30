import { getServerSession } from "@/app/data/get-session";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AuthBtns from "./AuthBtns";
import UserDropdown from "./UserDropdown";

const Navbar = async () => {
  const session = await getServerSession();
  const user = session?.user;

  return (
    <div className={`fixed top-0 left-0 z-50 h-15 w-full shadow-xl`}>
      <header className="bg-primary-700 grid w-full grid-cols-3 items-center justify-between px-8 py-3 text-white">
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

        <p className="text-primary-200 hidden text-center md:block">
          Discover your rental apartment with our advanced search
        </p>

        <div className="flex items-center justify-end">
          <Button
            asChild
            size="icon"
            className="bg-secondary-500 hover:bg-secondary-600 mr-2 rounded-lg text-white"
          >
            <Link href="/search">
              <Search />
            </Link>
          </Button>
          {user ? <UserDropdown user={user} /> : <AuthBtns />}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
