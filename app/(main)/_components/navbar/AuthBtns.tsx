import { Button } from "@/components/ui/button";
import Link from "next/link";

const AuthBtns = () => {
  return (
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
  );
};

export default AuthBtns;
