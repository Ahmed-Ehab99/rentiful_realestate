import { getServerSession } from "@/app/data/get-session";
import { Skeleton } from "@/components/ui/skeleton";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { forbidden, unauthorized } from "next/navigation";
import { Suspense } from "react";
import Header from "../../_components/Header";
import NewPropertyForm from "./_components/NewPropertyForm";

export const metadata = createPageMetadata({
  title: "Add new property",
  description:
    "Create a new rental listing with photos, pricing, amenities, and availability on Rentiful.",
  noIndex: true,
});

const NewPropertyPage = () => {
  return (
    <>
      <Header
        title="Add New Property"
        subtitle="Create a new property listing with detailed information"
      />

      <Suspense fallback={<Skeleton className="h-screen w-full" />}>
        <RenderNewProperty />
      </Suspense>
    </>
  );
};

export default NewPropertyPage;

const RenderNewProperty = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();
  if (user.role !== "manager") forbidden();

  return <NewPropertyForm user={user} />;
};
