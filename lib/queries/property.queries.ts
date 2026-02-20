import { prisma } from "@/lib/db";
import { Prisma } from "@/prisma/generated/prisma/client";
import { Amenity, PropertyType } from "@/prisma/generated/prisma/enums";

export type PropertyFilters = {
  favoriteIds?: number[];
  priceMin?: number;
  priceMax?: number;
  beds?: number | "any";
  baths?: number | "any";
  squareFeetMin?: number;
  squareFeetMax?: number;
  propertyType?: PropertyType | "any";
  amenities?: Amenity[] | "any";
  availableFrom?: string | "any";
};

/**
 * Builds a Prisma WhereInput from parsed filters.
 * Each block is independent — easy to add/remove filters later.
 */
function buildWhereClause(filters: PropertyFilters): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {};

  if (filters.favoriteIds?.length) {
    where.id = { in: filters.favoriteIds };
  }

  if (filters.priceMin || filters.priceMax) {
    where.pricePerMonth = {
      ...(filters.priceMin && { gte: filters.priceMin }),
      ...(filters.priceMax && { lte: filters.priceMax }),
    };
  }

  if (filters.beds && filters.beds !== "any") {
    where.beds = { gte: filters.beds };
  }

  if (filters.baths && filters.baths !== "any") {
    where.baths = { gte: filters.baths };
  }

  if (filters.squareFeetMin || filters.squareFeetMax) {
    where.squareFeet = {
      ...(filters.squareFeetMin && { gte: filters.squareFeetMin }),
      ...(filters.squareFeetMax && { lte: filters.squareFeetMax }),
    };
  }

  if (filters.propertyType && filters.propertyType !== "any") {
    where.propertyType = filters.propertyType;
  }

  // hasSome: property must have at least one of the selected amenities
  if (filters.amenities && filters.amenities !== "any") {
    where.amenities = { hasSome: filters.amenities };
  }

  // Property has a lease that started on or before the requested date
  if (filters.availableFrom && filters.availableFrom !== "any") {
    where.leases = {
      some: { startDate: { lte: new Date(filters.availableFrom) } },
    };
  }

  return where;
}

/**
 * getProperties → was GET /properties
 * Filtering is pure Prisma — no raw SQL needed since we store
 * lat/lng as plain Floats (geo filter will be added later).
 */
export async function getProperties(filters: PropertyFilters = {}) {
  const properties = await prisma.property.findMany({
    where: buildWhereClause(filters),
    include: { location: true },
    orderBy: { postedDate: "desc" },
  });
  return properties;
}

/**
 * getProperty → was GET /properties/:id
 * Returns null if not found — caller uses notFound() from next/navigation.
 */
export async function getProperty(id: number) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: { location: true },
  });
  return property;
}
