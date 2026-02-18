"use server";

import { prisma } from "@/lib/db";
import { SettingsFormData, settingsSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthUser } from "../data/get-auth-user";

export async function getSettingsData() {
  const user = await getAuthUser();

  if (user.role === "manager") {
    const manager = await prisma.manager.findUnique({
      where: { userId: user.id },
    });
    if (!manager) redirect("/signup");
    return { userType: "manager" as const, data: manager };
  }

  const tenant = await prisma.tenant.findUnique({
    where: { userId: user.id },
  });
  if (!tenant) redirect("/signup");
  return { userType: "tenant" as const, data: tenant };
}

export async function updateSettings(formData: SettingsFormData) {
  const user = await getAuthUser();
  try {
    const result = settingsSchema.safeParse(formData);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid Data",
      };
    }

    const { name, email, phoneNumber } = result.data;

    if (user.role === "manager") {
      await prisma.manager.update({
        where: { userId: user.id },
        data: { name, email, phoneNumber },
      });
    } else {
      await prisma.tenant.update({
        where: { userId: user.id },
        data: { name, email, phoneNumber },
      });
    }

    revalidatePath(`/${user.role}s/settings`);

    return {
      status: "success",
      message: "Informations updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update informations",
    };
  }
}
