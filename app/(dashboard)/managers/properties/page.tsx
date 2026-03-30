import { getServerSession } from "@/app/data/get-session";
import EmptyState from "@/components/EmptyState";
import PropertyCard from "@/components/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getManagerProperties } from "@/lib/queries/manager.queries";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { House } from "lucide-react";
import { forbidden, unauthorized } from "next/navigation";
import { Suspense } from "react";
import Header from "../../_components/Header";

export const metadata = createPageMetadata({
  title: "My properties",
  description:
    "Manage your rental listings, open units, and property details on Rentiful.",
  noIndex: true,
});

const PropertiesPage = async () => {
  return (
    <>
      <Header
        title="My Properties"
        subtitle="View and manage your property listings"
      />

      <Suspense fallback={<PropertiesSkeleton />}>
        <RenderProperties />
      </Suspense>
    </>
  );
};

export default PropertiesPage;

const RenderProperties = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();
  if (user.role !== "manager") forbidden();

  const managerProperties = await getManagerProperties(user.id);

  return (
    <>
      {managerProperties && managerProperties.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {managerProperties?.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              showFavoriteButton={false}
              isFavorite={false}
              propertyLink={`/managers/properties/${property.id}`}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          Icon={House}
          title="No properties"
          description="You don't have any property linked to your account."
          btnHref="/search"
          btnText="Explore Properties"
        />
      )}
    </>
  );
};

const PropertiesSkeleton = () => {
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
