"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useSearchFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Sets a single filter key in the URL.
   * Deletes the key if value is empty or "any" — keeps URLs clean.
   */
  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === "any") params.delete(key);
      else params.set(key, value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  /**
   * Sets a min/max range as two separate URL params.
   * e.g. setRangeFilter("price", [500, null]) → ?priceMin=500
   */
  const setRangeFilter = useCallback(
    (key: string, [min, max]: [number | null, number | null]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (min === null) params.delete(`${key}Min`);
      else params.set(`${key}Min`, String(min));
      if (max === null) params.delete(`${key}Max`);
      else params.set(`${key}Max`, String(max));
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  return { setFilter, setRangeFilter };
}
