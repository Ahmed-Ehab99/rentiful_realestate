import { getServerSession } from "@/app/data/get-session";
import EmptyState from "@/components/EmptyState";
import PropertyCard from "@/components/PropertyCard";
import { getTenant } from "@/lib/queries/tenant.queries";
import { Heart } from "lucide-react";
import Header from "../../_components/Header";
import { forbidden, unauthorized } from "next/navigation";

const FavoritesPage = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();
  if (user.role !== "tenant") forbidden();

  const tenant = await getTenant(user.id);

  return (
    <>
      <Header
        title="Favorited Properties"
        subtitle="Browse and manage your saved property listings"
      />
      {tenant.favorites && tenant.favorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tenant.favorites.map((property) => (
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
          Icon={Heart}
          title="No favorites yet"
          description="You haven't saved any property listings to your favorites."
          btnHref="/search"
          btnText="Explore Property"
        />
      )}
    </>
  );
};

export default FavoritesPage;
