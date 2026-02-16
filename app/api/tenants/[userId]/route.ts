import {
  notFound,
  ok,
  parseBody,
  requireSelf,
  withErrorBoundary,
} from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

interface RouteContext {
  params: Promise<{ userId: string }>;
}

// ─── Get Tenant ───────────────────────────────────────────────────────

export const GET = withErrorBoundary(
  "GET /api/tenants/[userId]",
  async (_req, ctx) => {
    const { userId } = await (ctx as RouteContext).params;

    // Users can only read their own profile.
    const auth = await requireSelf(userId);
    if (auth instanceof NextResponse) return auth;

    const tenant = await prisma.tenant.findUnique({
      where: { userId },
      include: {
        favorites: true,
      },
    });

    if (!tenant) return notFound("Tenant profile not found");

    return ok(tenant);
  },
);

// ─── Update Tenant ───────────────────────────────────────────────────────

const UpdateTenantSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().min(1).optional(),
});

export const PUT = withErrorBoundary(
  "PUT /api/tenants/[userId]",
  async (req, ctx) => {
    const { userId } = await (ctx as RouteContext).params;

    const auth = await requireSelf(userId);
    if (auth instanceof NextResponse) return auth;

    const body = await parseBody(req, UpdateTenantSchema);
    if (body instanceof NextResponse) return body;

    const tenant = await prisma.tenant.update({
      where: { userId },
      data: body,
    });

    return ok(tenant);
  },
);
