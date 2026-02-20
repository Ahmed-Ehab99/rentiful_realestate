import { prisma } from "@/lib/db";

/**
 * getTenant → was GET /tenants/:cognitoId
 * Includes favorites so the client knows which properties are already saved.
 */
export async function getTenant(userId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { userId },
    include: { favorites: true },
  });
  return tenant; // null if not found — caller handles it
}

/**
 * getCurrentResidences → was GET /tenants/:cognitoId/current-residences
 * No WKT/PostGIS parsing — plain lat/lng Floats come back directly from Prisma.
 */
export async function getCurrentResidences(userId: string) {
  const properties = await prisma.property.findMany({
    where: {
      tenants: { some: { userId } },
    },
    include: { location: true },
    orderBy: { postedDate: "desc" },
  });
  return properties;
}
