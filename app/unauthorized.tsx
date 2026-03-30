import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  return (
    <div className="animate-in fade-in zoom-in flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center duration-500">
      <div className="bg-primary-100 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
        <div className="bg-primary-200 flex h-16 w-16 items-center justify-center rounded-full">
          <Lock className="text-primary-800" size={32} />
        </div>
      </div>

      <h1 className="text-foreground mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
        Authentication Required
      </h1>

      <p className="text-muted-foreground mb-8 max-w-md text-base md:text-lg">
        You need to be signed in to access this page. Please log in to your
        account to continue.
      </p>

      <div className="mt-4 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
        <Button
          asChild
          className="bg-primary-700 hover:bg-primary-600 h-11 px-8 text-white"
        >
          <Link href="/login">Sign In</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-primary-200 text-primary-800 hover:bg-primary-50 h-11 px-8"
        >
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
