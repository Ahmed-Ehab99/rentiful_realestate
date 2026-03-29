import { getServerSession } from "@/app/data/get-session";
import EmptyState from "@/components/EmptyState";
import PropertyCard from "@/components/PropertyCard";
import { getManagerProperties } from "@/lib/queries/manager.queries";
import { House } from "lucide-react";
import Header from "../../_components/Header";
import { forbidden, unauthorized } from "next/navigation";

const PropertiesPage = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();
  if (user.role !== "manager") forbidden();

  const managerProperties = await getManagerProperties(user.id);

  return (
    <>
      <Header
        title="My Properties"
        subtitle="View and manage your property listings"
      />
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

export default PropertiesPage;
