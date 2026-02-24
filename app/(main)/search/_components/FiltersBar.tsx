"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFiltersBar } from "@/hooks/use-filters-bar";
import { PropertyTypeIcons } from "@/lib/constants";
import { cn, formatPriceValue } from "@/lib/utils";
import { Filter, Grid, List, Loader2, Search } from "lucide-react";
import FiltersFull from "./FiltersFull";

const FiltersBar = () => {
  const {
    beds,
    baths,
    propertyType,
    viewMode,
    priceRange,
    searchInput,
    setSearchInput,
    isSearching,
    handleLocationSearch,
    handlePriceChange,
    setFilter,
    setViewMode,
  } = useFiltersBar();

  return (
    <div className="flex w-full flex-wrap items-center justify-between py-5">
      <div className="flex flex-wrap items-center gap-4 p-2">
        {/* All Filters — renders FiltersFull with a custom trigger button */}
        <FiltersFull
          trigger={
            <Button
              variant="outline"
              className={cn(
                "border-primary-400 hover:bg-primary-500 hover:text-primary-100 gap-2 rounded-xl",
              )}
            >
              <Filter className="h-4 w-4" />
              <span>All Filters</span>
            </Button>
          }
        />

        {/* Location search */}
        <div className="flex items-center">
          <Input
            placeholder="Search location"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLocationSearch()}
            className="border-primary-400 w-40 rounded-l-xl rounded-r-none border-r-0"
            disabled={isSearching}
          />
          <Button
            onClick={handleLocationSearch}
            disabled={isSearching}
            className="border-l-none border-primary-400 hover:bg-primary-700 hover:text-primary-50 rounded-l-none rounded-r-xl border shadow-none"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Price range */}
        <div className="flex gap-1">
          <Select
            value={priceRange[0]?.toString() ?? "any"}
            onValueChange={(value) => handlePriceChange(value, true)}
          >
            <SelectTrigger className="border-primary-400 w-fit rounded-xl">
              <SelectValue>{formatPriceValue(priceRange[0], true)}</SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any">Any Min Price</SelectItem>
              {[500, 1000, 1500, 2000, 3000, 5000, 10000].map((price) => (
                <SelectItem key={price} value={price.toString()}>
                  ${price / 1000}k+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={priceRange[1]?.toString() ?? "any"}
            onValueChange={(value) => handlePriceChange(value, false)}
          >
            <SelectTrigger className="border-primary-400 w-fit rounded-xl">
              <SelectValue>
                {formatPriceValue(priceRange[1], false)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any">Any Max Price</SelectItem>
              {[1000, 2000, 3000, 5000, 10000].map((price) => (
                <SelectItem key={price} value={price.toString()}>
                  &lt;${price / 1000}k
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Beds */}
        <div className="flex gap-1">
          <Select
            value={beds}
            onValueChange={(value) => setFilter("beds", value)}
          >
            <SelectTrigger className="border-primary-400 w-fit rounded-xl">
              <SelectValue placeholder="Beds" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any">Any Beds</SelectItem>
              <SelectItem value="1">1+ bed</SelectItem>
              <SelectItem value="2">2+ beds</SelectItem>
              <SelectItem value="3">3+ beds</SelectItem>
              <SelectItem value="4">4+ beds</SelectItem>
            </SelectContent>
          </Select>

          {/* Baths */}
          <Select
            value={baths}
            onValueChange={(value) => setFilter("baths", value)}
          >
            <SelectTrigger className="border-primary-400 w-fit rounded-xl">
              <SelectValue placeholder="Baths" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any">Any Baths</SelectItem>
              <SelectItem value="1">1+ bath</SelectItem>
              <SelectItem value="2">2+ baths</SelectItem>
              <SelectItem value="3">3+ baths</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property type */}
        <Select
          value={propertyType}
          onValueChange={(value) => setFilter("propertyType", value)}
        >
          <SelectTrigger className="border-primary-400 w-fit rounded-xl">
            <SelectValue placeholder="Home Type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="any">Any Property Type</SelectItem>
            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
              <SelectItem key={type} value={type}>
                <div className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{type}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View mode */}
      <div className="flex items-center justify-between gap-4 p-2">
        <div className="flex rounded-xl border">
          <Button
            variant="ghost"
            className={cn(
              "hover:bg-primary-600 hover:text-primary-50 rounded-none rounded-l-xl px-3 py-1",
              viewMode === "list" && "bg-primary-700 text-primary-50",
            )}
            onClick={() => setViewMode("list")}
          >
            <List className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "hover:bg-primary-600 hover:text-primary-50 rounded-none rounded-r-xl px-3 py-1",
              viewMode === "grid" && "bg-primary-700 text-primary-50",
            )}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
