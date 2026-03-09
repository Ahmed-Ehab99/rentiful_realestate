"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useFiltersFull } from "@/hooks/use-filters-full";
import { AmenityIcons, PropertyTypeIcons } from "@/lib/constants";
import { cn, formatEnumString } from "@/lib/utils";
import { Amenity } from "@/prisma/generated/prisma/enums";
import { ReactNode } from "react";

const FiltersFull = ({ trigger }: { trigger?: ReactNode }) => {
  const {
    open,
    localFilters,
    handleOpenChange,
    handleApply,
    handleReset,
    handleAmenityToggle,
    updateFilter,
    updatePriceRange,
    updateSquareFeetRange,
    togglePropertyType,
  } = useFiltersFull();

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader className="sr-only">
          <SheetTitle>Filter Properties</SheetTitle>
          <SheetDescription>Search and filter our properties</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col space-y-6 px-4 py-4">
          {/* Property Type */}
          <div>
            <h4 className="mb-2 font-bold">Property Type</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
                <Button
                  variant={
                    localFilters.propertyType === type ? "default" : "outline"
                  }
                  key={type}
                  className={cn(
                    "h-fit flex-col rounded-xl py-4",
                    localFilters.propertyType === type && "border",
                  )}
                  onClick={() => togglePropertyType(type)}
                >
                  <Icon className="mb-2 size-6" />
                  <span className="text-sm">{type}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="mb-2 font-bold">Price Range (Monthly)</h4>
            <Slider
              min={0}
              max={10000}
              step={100}
              value={[localFilters.priceMin, localFilters.priceMax]}
              onValueChange={([min, max]) => updatePriceRange(min, max)}
            />
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>${localFilters.priceMin.toLocaleString()}</span>
              <span>${localFilters.priceMax.toLocaleString()}</span>
            </div>
          </div>

          {/* Beds and Baths */}
          <div className="flex gap-4">
            <div className="flex-1">
              <h4 className="mb-2 font-bold">Beds</h4>
              <Select
                value={localFilters.beds}
                onValueChange={(value) => updateFilter("beds", value)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Beds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any beds</SelectItem>
                  {[1, 2, 3, 4].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}+ beds
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <h4 className="mb-2 font-bold">Baths</h4>
              <Select
                value={localFilters.baths}
                onValueChange={(value) => updateFilter("baths", value)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Baths" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any baths</SelectItem>
                  {[1, 2, 3].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}+ baths
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Square Feet */}
          <div>
            <h4 className="mb-2 font-bold">Square Feet</h4>
            <Slider
              min={0}
              max={5000}
              step={100}
              value={[localFilters.squareFeetMin, localFilters.squareFeetMax]}
              onValueChange={([min, max]) => updateSquareFeetRange(min, max)}
            />
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>{localFilters.squareFeetMin.toLocaleString()} sq ft</span>
              <span>{localFilters.squareFeetMax.toLocaleString()} sq ft</span>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h4 className="mb-2 font-bold">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(AmenityIcons).map(([amenity, Icon]) => (
                <Button
                  variant={
                    localFilters.amenities.includes(amenity as Amenity)
                      ? "default"
                      : "outline"
                  }
                  key={amenity}
                  className="rounded-xl"
                  onClick={() => handleAmenityToggle(amenity as Amenity)}
                >
                  <Icon className="size-4" />
                  <Label className="cursor-pointer text-sm">
                    {formatEnumString(amenity)}
                  </Label>
                </Button>
              ))}
            </div>
          </div>

          {/* Available From */}
          <div>
            <h4 className="mb-2 font-bold">Available From</h4>
            <Input
              type="date"
              value={localFilters.availableFrom}
              onChange={(e) => updateFilter("availableFrom", e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>

        <SheetFooter className="flex gap-3 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 rounded-xl"
          >
            Reset
          </Button>
          <Button onClick={handleApply} className="flex-1 rounded-xl">
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersFull;
