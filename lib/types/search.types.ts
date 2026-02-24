export type ViewMode = "grid" | "list";

/**
 * Direct equivalent of FiltersState from the Redux slice.
 * Lives in the URL instead of a store.
 * priceRange and squareFeet are serialized as "min,max" in the URL.
 */
export type SearchFilters = {
  location: string;
  beds: string;
  baths: string;
  propertyType: string;
  amenities: string[];
  availableFrom: string;
  priceRange: [number | null, number | null];
  squareFeet: [number | null, number | null];
  coordinates: [number, number];
  view: ViewMode;
};

// Default values — replaces initialState.filters
export const DEFAULT_FILTERS: SearchFilters = {
  location: "Los Angeles",
  beds: "any",
  baths: "any",
  propertyType: "any",
  amenities: [],
  availableFrom: "any",
  priceRange: [null, null],
  squareFeet: [null, null],
  coordinates: [-118.25, 34.05],
  view: "grid",
};
