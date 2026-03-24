import { getAuthUser } from "@/app/data/get-auth-user";
import EmptyState from "@/components/EmptyState";
import PropertyCard from "@/components/PropertyCard";
import { getCurrentResidences } from "@/lib/queries/tenant.queries";
import { House } from "lucide-react";
import Header from "../../_components/Header";

const ResidencesPage = async () => {
  const user = await getAuthUser();
  const residences = await getCurrentResidences(user.id);

  return (
    <>
      <Header
        title="Favorited Properties"
        subtitle="Browse and manage your saved property listings"
      />
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

export default ResidencesPage;
