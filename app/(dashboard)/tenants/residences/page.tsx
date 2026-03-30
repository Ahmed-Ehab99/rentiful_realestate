import { getServerSession } from "@/app/data/get-session";
import EmptyState from "@/components/EmptyState";
import PropertyCard from "@/components/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentResidences } from "@/lib/queries/tenant.queries";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { House } from "lucide-react";
import { forbidden, unauthorized } from "next/navigation";
import { Suspense } from "react";
import Header from "../../_components/Header";

export const metadata = createPageMetadata({
  title: "My residences",
  description:
    "See your current rental homes and jump to lease details and payments on Rentiful.",
  noIndex: true,
});

const ResidencesPage = async () => {
  return (
    <>
      <Header
        title="Current Residences"
        subtitle="View and manage your current living spaces"
      />

      <Suspense fallback={<ResidencesSkeleton />}>
        <RenderResidences />
      </Suspense>
    </>
  );
};

export default ResidencesPage;

const RenderResidences = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();
  if (user.role !== "tenant") forbidden();

  const residences = await getCurrentResidences(user.id);

  return (
    <>
      {residences && residences.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {residences.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={true}
              propertyLink={`/tenants/residences/${property.id}`}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          Icon={House}
          title="No active residences"
          description="You don't have any current property residencies linked to your account."
          btnHref="/search"
          btnText="Explore Properties"
        />
      )}
    </>
  );
};

const ResidencesSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-91 w-full rounded-xl md:h-110 lg:h-91"
        />
      ))}
    </div>
  );
};
