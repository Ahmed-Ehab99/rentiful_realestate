/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSearchFilters } from "./use-search-filters";

export function useFiltersBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { setFilter, setRangeFilter } = useSearchFilters();

  const { beds, baths, propertyType, priceRange, viewMode } = useMemo(
    () => ({
      beds: searchParams.get("beds") ?? "any",
      baths: searchParams.get("baths") ?? "any",
      propertyType: searchParams.get("propertyType") ?? "any",
      priceRange: [
        searchParams.get("priceMin")
          ? Number(searchParams.get("priceMin"))
          : null,
        searchParams.get("priceMax")
          ? Number(searchParams.get("priceMax"))
          : null,
      ] as [number | null, number | null],
      viewMode: (searchParams.get("view") ?? "grid") as "grid" | "list",
    }),
    [searchParams],
  );

  const setViewMode = useCallback(
    (mode: "grid" | "list") => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", mode);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );
  const [searchInput, setSearchInput] = useState(
    searchParams.get("location") ?? "Los Angeles",
  );
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Geocodes via our own API route to avoid CORS issues.
   * The server-side route proxies to Nominatim.
   */
  const handleLocationSearch = useCallback(async () => {
    setIsSearching(true);

    try {
      const res = await fetch(
        `/api/geocode?${new URLSearchParams({ q: searchInput })}`,
      );
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        console.error("Geocode error:", data.error);
        return;
      }

      const params = new URLSearchParams(searchParams.toString());

      if (data.lat !== null && data.lng !== null) {
        // Location found → set coordinates and location
        params.set("location", searchInput);
        params.set("coordinates", `${data.lng},${data.lat}`);
      } else {
        // Empty query → clear location filters to show all properties
        params.delete("location");
        params.delete("coordinates");
      }

      router.push(`${pathname}?${params.toString()}`);
    } catch (err: any) {
      toast.error(err);
      console.error("Error searching location:", err);
    } finally {
      setIsSearching(false);
    }
  }, [searchInput, searchParams, pathname, router]);

  const handlePriceChange = useCallback(
    (value: string, isMin: boolean) => {
      const updated: [number | null, number | null] = [...priceRange];
      updated[isMin ? 0 : 1] = value === "any" ? null : Number(value);
      setRangeFilter("price", updated);
    },
    [priceRange, setRangeFilter],
  );

  return {
    beds,
    baths,
    propertyType,
    priceRange,
    viewMode,
    setViewMode,
    searchInput,
    setSearchInput,
    isSearching,
    handleLocationSearch,
    handlePriceChange,
    setFilter,
  };
}
