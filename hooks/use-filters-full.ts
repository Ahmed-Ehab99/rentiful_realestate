"use client";

import { Amenity, PropertyType } from "@/prisma/generated/prisma/enums";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export type LocalFilters = {
  propertyType: PropertyType | "any";
  priceMin: number;
  priceMax: number;
  beds: string;
  baths: string;
  squareFeetMin: number;
  squareFeetMax: number;
  amenities: Amenity[];
  availableFrom: string;
};

const DEFAULT_FILTERS: LocalFilters = {
  propertyType: "any",
  priceMin: 0,
  priceMax: 10000,
  beds: "any",
  baths: "any",
  squareFeetMin: 0,
  squareFeetMax: 5000,
  amenities: [],
  availableFrom: "",
};

function initFromParams(searchParams: URLSearchParams): LocalFilters {
  return {
    propertyType: (searchParams.get("propertyType") as PropertyType) ?? "any",
    priceMin: Number(searchParams.get("priceMin") ?? 0),
    priceMax: Number(searchParams.get("priceMax") ?? 10000),
    beds: searchParams.get("beds") ?? "any",
    baths: searchParams.get("baths") ?? "any",
    squareFeetMin: Number(searchParams.get("squareFeetMin") ?? 0),
    squareFeetMax: Number(searchParams.get("squareFeetMax") ?? 5000),
    amenities: searchParams.get("amenities")
      ? (searchParams.get("amenities")!.split(",") as Amenity[])
      : [],
    availableFrom: searchParams.get("availableFrom") ?? "",
  };
}

export function useFiltersFull() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<LocalFilters>(() =>
    initFromParams(searchParams),
  );

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalFilters(initFromParams(searchParams));
    }
    setOpen(isOpen);
  };
  
  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    const set = (key: string, value: string | null) => {
      if (value === null || value === "" || value === "any") params.delete(key);
      else params.set(key, value);
    };

    set("propertyType", localFilters.propertyType);
    set("beds", localFilters.beds);
    set("baths", localFilters.baths);
    set("availableFrom", localFilters.availableFrom);

    if (localFilters.priceMin > 0)
      params.set("priceMin", String(localFilters.priceMin));
    else params.delete("priceMin");

    if (localFilters.priceMax < 10000)
      params.set("priceMax", String(localFilters.priceMax));
    else params.delete("priceMax");

    if (localFilters.squareFeetMin > 0)
      params.set("squareFeetMin", String(localFilters.squareFeetMin));
    else params.delete("squareFeetMin");

    if (localFilters.squareFeetMax < 5000)
      params.set("squareFeetMax", String(localFilters.squareFeetMax));
    else params.delete("squareFeetMax");

    if (localFilters.amenities.length > 0)
      params.set("amenities", localFilters.amenities.join(","));
    else params.delete("amenities");

    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const handleReset = () => {
    setLocalFilters(DEFAULT_FILTERS);
    router.push(pathname);
    setOpen(false);
  };

  const handleAmenityToggle = useCallback((amenity: Amenity) => {
    setLocalFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }, []);

  const updateFilter = <K extends keyof LocalFilters>(
    key: K,
    value: LocalFilters[K],
  ) => setLocalFilters((prev) => ({ ...prev, [key]: value }));

  const updatePriceRange = (min: number, max: number) =>
    setLocalFilters((prev) => ({ ...prev, priceMin: min, priceMax: max }));

  const updateSquareFeetRange = (min: number, max: number) =>
    setLocalFilters((prev) => ({
      ...prev,
      squareFeetMin: min,
      squareFeetMax: max,
    }));

  const togglePropertyType = (type: string) =>
    setLocalFilters((prev) => ({
      ...prev,
      propertyType: prev.propertyType === type ? "any" : (type as PropertyType),
    }));

  const activeFilterCount = [
    localFilters.propertyType !== "any",
    localFilters.beds !== "any",
    localFilters.baths !== "any",
    localFilters.priceMin > 0 || localFilters.priceMax < 10000,
    localFilters.squareFeetMin > 0 || localFilters.squareFeetMax < 5000,
    localFilters.amenities.length > 0,
    localFilters.availableFrom,
  ].filter(Boolean).length;

  return {
    open,
    localFilters,
    activeFilterCount,
    handleOpenChange,
    handleApply,
    handleReset,
    handleAmenityToggle,
    updateFilter,
    updatePriceRange,
    updateSquareFeetRange,
    togglePropertyType,
  };
}
