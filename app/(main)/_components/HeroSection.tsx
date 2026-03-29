"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";

const HeroSection = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleHeroSearch = useCallback(async () => {
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
      console.error("Hero search error:", err);
    } finally {
      setIsSearching(false);
    }
  }, [router, searchInput]);

  return (
    <div className="relative h-screen">
      <Image
        src="/landing-splash.jpg"
        alt="Rentiful Rental Platform Hero Section"
        fill
        className="object-cover object-center"
        priority
      />

      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/2 w-full -translate-y-1/2 transform text-center"
      >
        <div className="mx-auto max-w-4xl px-8">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Start your journey to finding the perfect place to call home
          </h1>

          <p className="mb-8 text-xl text-white">
            Explore our wide range of rental properties tailored to fit your
            lifestyle and needs!
          </p>

          <div className="flex justify-center">
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleHeroSearch()}
              placeholder="Search by city, neighborhood or address"
              className="h-12 w-full max-w-lg rounded-none rounded-l-xl border-none bg-white"
              disabled={isSearching}
            />

            <Button
              onClick={handleHeroSearch}
              disabled={isSearching}
              className="bg-secondary-500 hover:bg-secondary-600 h-12 rounded-none rounded-r-xl border-none text-white"
            >
              <span className="flex items-center justify-center gap-2">
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span>Search</span>
              </span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
