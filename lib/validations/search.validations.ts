import { DEFAULT_FILTERS, SearchFilters } from "../types/search.types";

/**
 * Converts raw URL search params into a typed SearchFilters object.
 * Equivalent to what the Redux useEffect in SearchPage was doing —
 * parsing entries and dispatching setFilters() — but as a plain function
 * called once on the server.
 */
export function parseSearchFilters(
  params: Record<string, string | string[] | undefined>,
): SearchFilters {
  const get = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : undefined;

  // priceRange → "500,2000" or ",2000" or "500,"
  const priceRaw = get("priceRange");
  const priceRange: [number | null, number | null] = priceRaw
    ? (priceRaw.split(",").map((v) => (v === "" ? null : Number(v))) as [
        number | null,
        number | null,
      ])
    : DEFAULT_FILTERS.priceRange;

  // squareFeet → same pattern as priceRange
  const sqRaw = get("squareFeet");
  const squareFeet: [number | null, number | null] = sqRaw
    ? (sqRaw.split(",").map((v) => (v === "" ? null : Number(v))) as [
        number | null,
        number | null,
      ])
    : DEFAULT_FILTERS.squareFeet;

  // coordinates → "-118.25,34.05"
  const coordRaw = get("coordinates");
  const coordinates: [number, number] = coordRaw
    ? (coordRaw.split(",").map(Number) as [number, number])
    : DEFAULT_FILTERS.coordinates;

  // amenities → "Pool,Gym,WiFi"
  const amenitiesRaw = get("amenities");
  const amenities = amenitiesRaw ? amenitiesRaw.split(",") : [];

  return {
    location: get("location") ?? DEFAULT_FILTERS.location,
    beds: get("beds") ?? DEFAULT_FILTERS.beds,
    baths: get("baths") ?? DEFAULT_FILTERS.baths,
    propertyType: get("propertyType") ?? DEFAULT_FILTERS.propertyType,
    availableFrom: get("availableFrom") ?? DEFAULT_FILTERS.availableFrom,
    view: (get("view") as "grid" | "list") ?? DEFAULT_FILTERS.view,
    priceRange,
    squareFeet,
    coordinates,
    amenities,
  };
}
