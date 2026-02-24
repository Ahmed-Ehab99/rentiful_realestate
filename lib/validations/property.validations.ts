import { Amenity, PropertyType } from "@/prisma/generated/prisma/enums";
import { PropertyFilters } from "../queries/property.queries";

/**
 * Parses raw URL search params into a strongly typed PropertyFilters object.
 * Handles the coordinates param format: "lng,lat"
 */
export function parsePropertyFilters(
  params: Record<string, string | string[] | undefined>,
): PropertyFilters {
  const str = (key: string): string | undefined => {
    const v = params[key];
    return typeof v === "string" ? v : undefined;
  };

  const num = (key: string): number | undefined => {
    const v = str(key);
    if (v === undefined || v === "") return undefined;
    const n = Number(v);
    return isNaN(n) ? undefined : n;
  };

  const filters: PropertyFilters = {};

  // Price
  const priceMin = num("priceMin");
  const priceMax = num("priceMax");
  if (priceMin !== undefined) filters.priceMin = priceMin;
  if (priceMax !== undefined) filters.priceMax = priceMax;

  // Beds & Baths
  const beds = str("beds");
  if (beds && beds !== "any") filters.beds = Number(beds);

  const baths = str("baths");
  if (baths && baths !== "any") filters.baths = Number(baths);

  // Square feet
  const sqMin = num("squareFeetMin");
  const sqMax = num("squareFeetMax");
  if (sqMin !== undefined) filters.squareFeetMin = sqMin;
  if (sqMax !== undefined) filters.squareFeetMax = sqMax;

  // Property type
  const propertyType = str("propertyType");
  if (propertyType && propertyType !== "any") {
    filters.propertyType = propertyType as PropertyType;
  }

  // Amenities
  const amenities = str("amenities");
  if (amenities) {
    filters.amenities = amenities.split(",") as Amenity[];
  }

  // Available from
  const availableFrom = str("availableFrom");
  if (availableFrom) filters.availableFrom = availableFrom;

  // Coordinates — format: "lng,lat"
  const coordinates = str("coordinates");
  if (coordinates) {
    const [lngStr, latStr] = coordinates.split(",");
    const lng = Number(lngStr);
    const lat = Number(latStr);
    if (!isNaN(lng) && !isNaN(lat)) {
      filters.coordinates = { lng, lat };
    }
  }

  return filters;
}
