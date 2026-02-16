import {
  conflict,
  created,
  getSessionUser,
  parseBody,
  unauthorized,
  withErrorBoundary,
} from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

// ─── Create Tenant ───────────────────────────────────────────────────────

const CreateTenantSchema = z.object({
  userId: z.string().uuid(),
});

export const POST = withErrorBoundary("POST /api/tenants", async (req) => {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return unauthorized();

  const body = await parseBody(req, CreateTenantSchema);
  if (body instanceof NextResponse) return body;

  if (body.userId !== sessionUser.id) {
    return unauthorized("Cannot create profile for another user");
  }

  // Pull name and email from the User row — no need to send them
  // from the client again since they're already in the database.
  const user = await prisma.user.findUnique({
    where: { id: body.userId },
    select: { name: true, email: true },
  });

  if (!user) return unauthorized("User not found");

  // Guard against duplicate profile creation (e.g. double request on first login).
  const existing = await prisma.tenant.findUnique({
    where: { userId: body.userId },
  });
  if (existing) return conflict("Tenant profile already exists");

  const tenant = await prisma.tenant.create({
    data: {
      userId: body.userId,
      name: user.name ?? "",
      email: user.email,
      phoneNumber: "",
    },
  });

  return created(tenant);
});
