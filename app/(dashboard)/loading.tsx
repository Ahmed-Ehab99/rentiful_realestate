import { Spinner } from "@/components/ui/spinner";

const DashboardLoading = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="size-20" />
    </div>
  );
};

export default DashboardLoading;
