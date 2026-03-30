import { Button } from "@/components/ui/button";
import { House, SearchX } from "lucide-react";
import Link from "next/link";

export default function ResidenceNotFound() {
  return (
    <div className="animate-in fade-in zoom-in flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center duration-500">
      <div className="bg-primary-100 relative mb-6 flex h-24 w-24 items-center justify-center rounded-full">
        <div className="bg-primary-200 flex h-16 w-16 items-center justify-center rounded-full">
          <House className="text-primary-800" size={32} />
        </div>
        {/* Small badge icon to indicate "missing" */}
        <div className="border-primary-100 absolute -right-1 -bottom-1 rounded-full border bg-white p-1">
          <SearchX className="text-destructive" size={16} />
        </div>
      </div>

      <h1 className="text-foreground mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
        Residence Details Unavailable
      </h1>

      <p className="text-muted-foreground mb-8 max-w-md text-base md:text-lg">
        We couldn&apos;t find the details for this residence. Your lease may
        have been archived or the link is expired.
      </p>

      <Button
        asChild
        className="bg-primary-700 hover:bg-primary-600 h-11 px-8 text-white"
      >
        <Link href="/tenants/residences">View My Residences</Link>
      </Button>
    </div>
  );
}
