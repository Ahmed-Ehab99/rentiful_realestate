import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className={`fixed top-0 left-0 z-50 h-12.5 w-full shadow-xl`}>
      <header className="bg-primary-700 flex w-full items-center justify-between px-8 py-2 text-white">
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

        {/* Paragraph */}
        <p className="text-primary-200 hidden md:block">
          Discover your rental apartment with our advanced search
        </p>

        {/* Auth Buttons */}
        <div className="flex items-center md:gap-2">
          <Button
            asChild
            variant="outline"
            className="hover:text-primary-700 hidden rounded-lg border-white bg-transparent text-white hover:bg-white md:block"
          >
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="bg-secondary-500 hover:bg-secondary-600 rounded-lg text-white"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
