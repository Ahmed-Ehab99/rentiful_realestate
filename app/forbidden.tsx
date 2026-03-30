import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <div className="animate-in fade-in zoom-in flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center duration-500">
      <div className="bg-destructive/10 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
        <div className="bg-destructive/20 flex h-16 w-16 items-center justify-center rounded-full">
          <ShieldAlert className="text-destructive" size={32} />
        </div>
      </div>

      <h1 className="text-foreground mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
        Access Denied
      </h1>

      <p className="text-muted-foreground mb-8 max-w-md text-base md:text-lg">
        You do not have the necessary permissions to view this resource. If you
        believe this is a mistake, please contact support.
      </p>

      <Button
        asChild
        className="bg-primary-700 hover:bg-primary-600 mt-4 h-11 px-8 text-white"
      >
        <Link href="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
