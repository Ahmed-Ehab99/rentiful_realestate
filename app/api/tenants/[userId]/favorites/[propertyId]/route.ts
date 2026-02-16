import {
  badRequest,
  conflict,
  notFound,
  ok,
  requireSelf,
  withErrorBoundary,
} from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ userId: string; propertyId: string }>;
}

// ─── Add Favorite Property ───────────────────────────────────────────────────────

export const POST = withErrorBoundary(
  "POST /api/tenants/[userId]/favorites/[propertyId]",
  async (_req, ctx) => {
    const { userId, propertyId } = await (ctx as RouteContext).params;

    const propertyIdNum = Number(propertyId);
    if (isNaN(propertyIdNum)) return badRequest("Invalid propertyId");

    const auth = await requireSelf(userId);
    if (auth instanceof NextResponse) return auth;

    const tenant = await prisma.tenant.findUnique({
      where: { userId },
      include: { favorites: true },
    });
    if (!tenant) return notFound("Tenant not found");

    const alreadyFavorited = tenant.favorites.some(
      (fav) => fav.id === propertyIdNum,
    );
    if (alreadyFavorited) return conflict("Property already added as favorite");

    const property = await prisma.property.findUnique({
      where: { id: propertyIdNum },
    });
    if (!property) return notFound("Property not found");

    const updated = await prisma.tenant.update({
      where: { userId },
      data: {
        favorites: { connect: { id: propertyIdNum } },
      },
      include: { favorites: true },
    });

    return ok(updated.favorites);
  },
);

// ─── Remove Favorite Property ───────────────────────────────────────────────────────

export const DELETE = withErrorBoundary(
  "DELETE /api/tenants/[userId]/favorites/[propertyId]",
  async (_req, ctx) => {
    const { userId, propertyId } = await (ctx as RouteContext).params;

    const propertyIdNum = Number(propertyId);
    if (isNaN(propertyIdNum)) return badRequest("Invalid propertyId");

    const auth = await requireSelf(userId);
    if (auth instanceof NextResponse) return auth;

    const tenant = await prisma.tenant.findUnique({ where: { userId } });
    if (!tenant) return notFound("Tenant profile not found");

    const updated = await prisma.tenant.update({
      where: { userId },
      data: { favorites: { disconnect: { id: propertyIdNum } } },
      include: { favorites: true },
    });

    return ok(updated);
  },
);
