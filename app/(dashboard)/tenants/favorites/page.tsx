import { getServerSession } from "@/app/data/get-session";
import EmptyState from "@/components/EmptyState";
import PropertyCard from "@/components/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getTenant } from "@/lib/queries/tenant.queries";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { Heart } from "lucide-react";
import { forbidden, unauthorized } from "next/navigation";
import { Suspense } from "react";
import Header from "../../_components/Header";

export const metadata = createPageMetadata({
  title: "Saved properties",
  description:
    "View and manage your favorite rental listings on Rentiful in one place.",
  noIndex: true,
});

const FavoritesPage = async () => {
  return (
    <>
      <Header
        title="Favorited Properties"
        subtitle="Browse and manage your saved property listings"
      />

      <Suspense fallback={<FavoritesSkeleton />}>
        <RenderFavorites />
      </Suspense>
    </>
  );
};

export default FavoritesPage;

const RenderFavorites = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();
  if (user.role !== "tenant") forbidden();

  const tenant = await getTenant(user.id);

  return (
    <>
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

const FavoritesSkeleton = () => {
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
