"use server";

import { requireTenant } from "@/app/data/require-tenant";
import { prisma } from "@/lib/db";
import { SettingsFormData, settingsSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

/**
 * createTenant → was POST /tenants
 * Same as createManager — already handled by your better-auth databaseHook.
 * Only here if you ever need to create a tenant outside the registration flow.
 */
export async function createTenant(data: SettingsFormData) {
  const user = await requireTenant();

  const tenant = await prisma.tenant.create({
    data: {
      userId: user.id,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
    },
  });

  return tenant;
}

/**
 * updateTenant → was PUT /tenants/:cognitoId
 * userId comes from the session — a tenant can only update their own profile.
 */
export async function updateTenant(data: SettingsFormData) {
  const user = await requireTenant();

  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const tenant = await prisma.tenant.update({
    where: { userId: user.id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phoneNumber: parsed.data.phoneNumber,
    },
  });

  return tenant;
}

/**
 * addFavoriteProperty → was POST /tenants/:cognitoId/favorites/:propertyId
 *
 * The Express version fetches the tenant first to check for duplicates,
 * then conditionally connects. In Prisma, connect on a many-to-many
 * relation is idempotent — connecting an already-connected record is a no-op,
 * so the duplicate check is unnecessary. One query instead of two.
 */
export async function addFavoriteProperty(propertyId: number) {
  const user = await requireTenant();

  const tenant = await prisma.tenant.update({
    where: { userId: user.id },
    data: {
      favorites: { connect: { id: propertyId } },
    },
    include: { favorites: true },
  });

  revalidatePath("/properties");
  return tenant;
}

/**
 * removeFavoriteProperty → was DELETE /tenants/:cognitoId/favorites/:propertyId
 *
 * disconnect on a many-to-many is also idempotent — safe to call even
 * if the property wasn't a favorite.
 */
export async function removeFavoriteProperty(propertyId: number) {
  const user = await requireTenant();

  const tenant = await prisma.tenant.update({
    where: { userId: user.id },
    data: {
      favorites: { disconnect: { id: propertyId } },
    },
    include: { favorites: true },
  });

  revalidatePath("/properties");
  return tenant;
}
