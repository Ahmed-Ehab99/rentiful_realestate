"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocationSearch } from "@/hooks/use-location-search";
import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";

const HeroSection = () => {
  const { searchInput, setSearchInput, isSearching, handleSearch } =
    useLocationSearch();

  return (
    <div className="relative h-screen">
      <Image
        src="/landing-splash.jpg"
        alt="Rentiful Rental Platform Hero Section"
        fill
        sizes="100vw"
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
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by city, neighborhood or address"
              className="h-12 w-full max-w-lg rounded-none rounded-l-xl border-none bg-white"
              disabled={isSearching}
            />

            <Button
              onClick={handleSearch}
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
