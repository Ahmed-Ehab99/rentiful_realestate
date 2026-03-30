import { Button } from "@/components/ui/button";
import { MapPinOff } from "lucide-react";
import Link from "next/link";

export default function SearchPropertyNotFound() {
  return (
    <div className="animate-in fade-in zoom-in flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center duration-500">
      <div className="bg-primary-100 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
        <div className="bg-primary-200 flex h-16 w-16 items-center justify-center rounded-full">
          <MapPinOff className="text-primary-800" size={32} />
        </div>
      </div>

      <h1 className="text-foreground mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
        Property Not Found
      </h1>

      <p className="text-muted-foreground mb-8 max-w-md text-base md:text-lg">
        The listing you are looking for doesn&apos;t exist. It may have been
        rented, removed, or the URL might be incorrect.
      </p>

      <Button
        asChild
        className="bg-primary-700 hover:bg-primary-600 h-11 px-8 text-white"
      >
        <Link href="/search">Back to Search</Link>
      </Button>
    </div>
  );
}
