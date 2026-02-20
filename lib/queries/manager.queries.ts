import { prisma } from "@/lib/db";

/**
 * getManager → was GET /managers/:cognitoId
 * We don't need cognitoId anymore — better-auth uses userId as the
 * universal identifier, which is already the FK on the Manager table.
 */
export async function getManager(userId: string) {
  const manager = await prisma.manager.findUnique({
    where: { userId },
  });
  return manager; // null if not found — let the caller handle it
}

/**
 * getManagerProperties → was GET /managers/:cognitoId/properties
 * No PostGIS/WKT parsing needed — your schema stores lat/lng as plain Floats,
 * so Prisma returns them directly in the location object.
 */
export async function getManagerProperties(userId: string) {
  const properties = await prisma.property.findMany({
    where: { managerUserId: userId },
    include: { location: true },
    orderBy: { postedDate: "desc" },
  });
  return properties;
}
