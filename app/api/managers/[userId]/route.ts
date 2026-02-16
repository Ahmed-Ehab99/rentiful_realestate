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

// ─── Get Manager ───────────────────────────────────────────────────────

export const GET = withErrorBoundary(
  "GET /api/managers/[userId]",
  async (_req, ctx) => {
    const { userId } = await (ctx as RouteContext).params;

    const auth = await requireSelf(userId);
    if (auth instanceof NextResponse) return auth;

    const manager = await prisma.manager.findUnique({
      where: { userId },
    });

    if (!manager) return notFound("Manager not found");

    return ok(manager);
  },
);

// ─── Update Manager ───────────────────────────────────────────────────────

const UpdateManagerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().min(1).optional(),
});

export const PUT = withErrorBoundary(
  "PUT /api/managers/[userId]",
  async (req, ctx) => {
    const { userId } = await (ctx as RouteContext).params;

    const auth = await requireSelf(userId);
    if (auth instanceof NextResponse) return auth;

    const body = await parseBody(req, UpdateManagerSchema);
    if (body instanceof NextResponse) return body;

    const manager = await prisma.manager.update({
      where: { userId },
      data: body,
    });

    return ok(manager);
  },
);
