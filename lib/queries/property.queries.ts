import { prisma } from "@/lib/db";
import { Prisma } from "@/prisma/generated/prisma/client";
import { Amenity, PropertyType } from "@/prisma/generated/prisma/enums";
import { notFound } from "next/navigation";

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
  coordinates?: { lng: number; lat: number };
  /** Search radius in km — defaults to 50 km when coordinates are provided */
  radius?: number;
};

/**
 * Haversine-based bounding box helper.
 * Returns min/max lat/lng for a square region around a point.
 * This is an approximation — good enough for filtering before
 * Prisma returns results; exact distance can be refined client-side.
 */
function getBoundingBox(
  lat: number,
  lng: number,
  radiusKm: number,
): {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
} {
  // 1 degree latitude ≈ 111 km
  const latDelta = radiusKm / 111;
  // 1 degree longitude varies by latitude
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  return {
    latMin: lat - latDelta,
    latMax: lat + latDelta,
    lngMin: lng - lngDelta,
    lngMax: lng + lngDelta,
  };
}

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

  if (filters.amenities && filters.amenities !== "any") {
    where.amenities = { hasSome: filters.amenities };
  }

  if (filters.availableFrom && filters.availableFrom !== "any") {
    where.leases = {
      some: { startDate: { lte: new Date(filters.availableFrom) } },
    };
  }

  // Geo filter: bounding box around the searched coordinates
  if (filters.coordinates) {
    const radiusKm = filters.radius ?? 50;
    const { latMin, latMax, lngMin, lngMax } = getBoundingBox(
      filters.coordinates.lat,
      filters.coordinates.lng,
      radiusKm,
    );

    where.location = {
      latitude: { gte: latMin, lte: latMax },
      longitude: { gte: lngMin, lte: lngMax },
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
export type PropertiesType = Awaited<ReturnType<typeof getProperties>>;

/**
 * getProperty → was GET /properties/:id
 * Returns null if not found — caller uses notFound() from next/navigation.
 */
export async function getProperty(id: number) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: { location: true },
  });

  if (!property) {
    return notFound();
  }

  return property;
}
export type PropertySingularType = Awaited<ReturnType<typeof getProperty>>;
