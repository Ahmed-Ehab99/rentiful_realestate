import { Skeleton } from "@/components/ui/skeleton";

const DetailsLoading = () => {
  return (
    <div>
      <Skeleton className="h-[75vh] w-full" />
      <div className="mx-10 mt-16 mb-8 flex flex-col justify-center gap-10 md:mx-auto md:w-2/3 md:flex-row">
        <Skeleton className="h-screen w-full" />
      </div>
    </div>
  );
};

export default DetailsLoading;
