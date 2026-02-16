import { notFound, ok, requireSelf, withErrorBoundary } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ userId: string }>;
}

// ─── Get Manager Properties ───────────────────────────────────────────────────────

export const GET = withErrorBoundary(
  "GET /api/managers/[userId]/properties",
  async (_req, ctx) => {
    const { userId } = await (ctx as RouteContext).params;

    const auth = await requireSelf(userId);
    if (auth instanceof NextResponse) return auth;

    const properties = await prisma.property.findMany({
      where: { managerUserId: userId },
      include: { location: true },
    });

    if (!properties.length)
      return notFound("No properties found for this manager");

    return ok(properties);
  },
);
