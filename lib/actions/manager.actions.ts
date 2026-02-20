"use server";

import { requireManager } from "@/app/data/require-manager";
import { prisma } from "@/lib/db";
import { SettingsFormData, settingsSchema } from "@/lib/schemas";

/**
 * createManager → was POST /managers
 * In your stack this is already handled automatically by the better-auth
 * databaseHook in lib/auth.ts (after user creation it creates the Manager row).
 * You only need this action if you want to manually create a manager outside
 * of the registration flow — otherwise you can delete it.
 */
export async function createManager(data: SettingsFormData) {
  const user = await requireManager();

  const manager = await prisma.manager.create({
    data: {
      userId: user.id,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
    },
  });

  return manager;
}

/**
 * updateManager → was PUT /managers/:cognitoId
 * We pull the userId from the session — a manager can only ever
 * update their own profile, never another manager's.
 */
export async function updateManager(data: SettingsFormData) {
  const user = await requireManager();

  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const manager = await prisma.manager.update({
    where: { userId: user.id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phoneNumber: parsed.data.phoneNumber,
    },
  });

  return manager;
}
