"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useLocationSearch = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async () => {
    const query = searchInput.trim();

    setIsSearching(true);
    try {
      // Empty search => go to the full listings page (no geo filter).
      if (!query) {
        router.push("/search");
        return;
      }

      // Reuses the existing app geocoding proxy to get lng/lat.
      const res = await fetch(
        `/api/geocode?${new URLSearchParams({ q: query })}`,
      );
      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error ?? "Failed to search location");
        return;
      }

      if (data.lat !== null && data.lng !== null) {
        const params = new URLSearchParams();
        params.set("location", query);
        params.set("coordinates", `${data.lng},${data.lat}`);
        router.push(`/search?${params.toString()}`);
      } else {
        // Geocode returned no coords => clear geo filter.
        router.push("/search");
      }
    } catch (err) {
      toast.error("Failed to search location");
      console.error("Location search error:", err);
    } finally {
      setIsSearching(false);
    }
  }, [router, searchInput]);

  return {
    searchInput,
    setSearchInput,
    isSearching,
    handleSearch,
  };
};
