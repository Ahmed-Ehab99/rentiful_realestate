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

// ─── Create Manager ───────────────────────────────────────────────────────

const CreateManagerSchema = z.object({
  userId: z.string(),
});

export const POST = withErrorBoundary("POST /api/managers", async (req) => {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return unauthorized();

  const body = await parseBody(req, CreateManagerSchema);
  if (body instanceof NextResponse) return body;

  if (body.userId !== sessionUser.id) {
    return unauthorized("Cannot create profile for another user");
  }

  const user = await prisma.user.findUnique({
    where: { id: body.userId },
    select: { name: true, email: true },
  });

  if (!user) return unauthorized("User not found");

  const existing = await prisma.manager.findUnique({
    where: { userId: body.userId },
  });
  if (existing) return conflict("Manager profile already exists");

  const manager = await prisma.manager.create({
    data: {
      userId: body.userId,
      name: user.name ?? "",
      email: user.email,
      phoneNumber: "",
    },
  });

  return created(manager);
});
