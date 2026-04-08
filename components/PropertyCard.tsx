"use client";

import {
  addFavoriteProperty,
  removeFavoriteProperty,
} from "@/lib/actions/tenant.actions";
import { PropertySingularType } from "@/lib/queries/property.queries";
import { Bath, Bed, Heart, House, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";

interface PropertyCardProps {
  property: PropertySingularType;
  isFavorite: boolean;
  showFavoriteButton?: boolean;
  propertyLink?: string;
}

const PropertyCard = ({
  property,
  isFavorite,
  showFavoriteButton = true,
  propertyLink,
}: PropertyCardProps) => {
  // Optimistic UI — flip the heart instantly, revert if the action fails
  const [optimisticFavorite, setOptimisticFavorite] = useState(isFavorite);
  const [isPending, startTransition] = useTransition();

  if (!property) return null;

  const handleFavoriteToggle = () => {
    setOptimisticFavorite((prev) => !prev);
    startTransition(async () => {
      try {
        if (optimisticFavorite) {
          await removeFavoriteProperty(property.id);
        } else {
          await addFavoriteProperty(property.id);
        }
      } catch {
        // Revert optimistic update on failure
        setOptimisticFavorite((prev) => !prev);
      }
    });
  };

  return (
    <div className="mb-5 w-full overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="relative">
        <div className="h-48 w-full">
          <Image
            src={property?.photoUrls?.[0]}
            alt={property.name}
            fill
            loading="eager"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {property.isPetsAllowed && (
            <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-black">
              Pets Allowed
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-black">
              Parking Included
            </span>
          )}
        </div>
        {showFavoriteButton && (
          <button
            className="absolute right-4 bottom-4 cursor-pointer rounded-full bg-white p-2 hover:bg-white/90 disabled:opacity-50"
            onClick={handleFavoriteToggle}
            disabled={isPending}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                optimisticFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600"
              }`}
            />
          </button>
        )}
      </div>

      <div className="p-4">
        <h2 className="mb-1 text-xl font-bold">
          {propertyLink ? (
            <Link
              href={propertyLink}
              className="hover:underline"
              scroll={false}
              prefetch
            >
              {property.name}
            </Link>
          ) : (
            property.name
          )}
        </h2>
        <p className="mb-2 text-gray-600">
          {property.location.address}, {property.location.city}
        </p>
        <div className="flex items-center justify-between">
          <div className="mb-2 flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-400" />
            <span className="font-semibold">
              {(property.averageRating ?? 0).toFixed(1)}
            </span>
            <span className="ml-1 text-gray-600">
              ({property.numberOfReviews ?? 0} Reviews)
            </span>
          </div>
          <p className="mb-3 text-lg font-bold">
            ${property.pricePerMonth.toFixed(0)}
            <span className="text-base font-normal text-gray-600"> /month</span>
          </p>
        </div>
        <hr />
        <div className="mt-5 flex items-center justify-between gap-4 text-gray-600">
          <span className="flex items-center">
            <Bed className="mr-2 h-5 w-5" />
            {property.beds} Bed
          </span>
          <span className="flex items-center">
            <Bath className="mr-2 h-5 w-5" />
            {property.baths} Bath
          </span>
          <span className="flex items-center">
            <House className="mr-2 h-5 w-5" />
            {property.squareFeet} sq ft
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
