import { Skeleton } from "@/components/ui/skeleton";
import { FiltersBarSkeleton } from "./_components/FiltersBar";

const SearchLoading = () => {
  return (
    <div className="mx-auto flex h-[calc(100vh-3.25rem)] w-full flex-col px-5">
      <FiltersBarSkeleton />
      <div className="mb-5 flex flex-1 flex-col justify-between gap-3 overflow-hidden md:flex-row">
        <div className="relative h-full grow overflow-hidden rounded-xl md:basis-7/12">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="md:basis-5/12">
          <Skeleton className="h-full w-full mx-4" />
        </div>
      </div>
    </div>
  );
};

export default SearchLoading;
