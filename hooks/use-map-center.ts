"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const DEFAULT_CENTER: [number, number] = [-118.2437, 34.0522]; // Los Angeles

export function useMapCenter(): [number, number] {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const coords = searchParams.get("coordinates");
    if (coords) {
      const [lng, lat] = coords.split(",").map(Number);
      if (!isNaN(lng) && !isNaN(lat)) return [lng, lat];
    }
    return DEFAULT_CENTER;
  }, [searchParams]);
}
