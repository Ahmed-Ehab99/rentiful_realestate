import { getServerSession } from "@/app/data/get-session";
import PropertyCard from "@/components/PropertyCard";
import { getProperties } from "@/lib/queries/property.queries";
import { getTenant } from "@/lib/queries/tenant.queries";
import { parsePropertyFilters } from "@/lib/validations/property.validations";
import { SearchX } from "lucide-react";
import PropertyCardCompact from "./PropertyCardCompact";

interface ListingsProps {
  searchParams: Record<string, string | string[] | undefined>;
  viewMode: "grid" | "list";
}

const Listings = async ({ searchParams, viewMode }: ListingsProps) => {
  const session = await getServerSession();

  const [properties, tenant] = await Promise.all([
    getProperties(parsePropertyFilters(searchParams)),
    session?.user.role === "tenant"
      ? getTenant(session.user.id)
      : Promise.resolve(null),
  ]);

  const favoriteIds = new Set(tenant?.favorites?.map((f) => f.id) ?? []);
  const location = searchParams.location as string | undefined;

  if (properties.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <SearchX className="h-8 w-8 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            No Properties Found
          </h3>
          <p className="max-w-sm text-sm text-gray-500">
            {location
              ? `We couldn't find any properties in "${location}". Try a different location or adjust your filters.`
              : "We couldn't find any properties matching your filters. Try adjusting your search criteria or clearing some filters."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="px-4 text-sm font-bold">
        {properties.length}{" "}
        <span className="font-normal text-gray-700">
          {location ? `Places in ${location}` : "Places available"}
        </span>
      </h3>
      <div className="w-full p-4">
        {properties.map((property) => {
          const isFavorite = favoriteIds.has(property.id);
          const props = {
            property,
            isFavorite,
            showFavoriteButton: session?.user.role === "tenant",
            propertyLink: `/search/${property.id}`,
          };

          return viewMode === "grid" ? (
            <PropertyCard key={property.id} {...props} />
          ) : (
            <PropertyCardCompact key={property.id} {...props} />
          );
        })}
      </div>
    </div>
  );
};

export default Listings;
