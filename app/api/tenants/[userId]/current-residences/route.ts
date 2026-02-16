import { notFound, ok, requireSelf, withErrorBoundary } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ userId: string }>;
}

// ─── Get Current Residences ───────────────────────────────────────────────────────

export const GET = withErrorBoundary(
  "GET /api/tenants/[userId]/current-residences",
  async (_req, ctx) => {
    const { userId } = await (ctx as RouteContext).params;

    const auth = await requireSelf(userId);
    if (auth instanceof NextResponse) return auth;

    const properties = await prisma.property.findMany({
      where: { tenants: { some: { userId } } },
      include: { location: true },
    });

    if (!properties.length) return notFound("No current residences found");

    return ok(properties);
  },
);
