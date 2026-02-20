"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateNextPaymentDate } from "@/lib/queries/application.queries";
import { applicationSchema } from "@/lib/schemas";
import { ApplicationStatus } from "@/prisma/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");
  return session.user;
}

async function requireManager() {
  const user = await requireAuth();
  if (user.role !== "manager") redirect("/");
  return user;
}

/**
 * createApplication → was POST /applications
 *
 * Key differences from Express:
 *  - tenantUserId comes from session, never from the request body
 *  - The Express version creates a lease eagerly on application submission,
 *    which means every application (even rejected ones) gets a lease created.
 *    We only create the lease on approval in updateApplicationStatus instead —
 *    more correct business logic.
 *  - Validates with Zod before touching the DB
 */
export async function createApplication(
  propertyId: number,
  formData: FormData,
) {
  const user = await requireAuth();

  // Only tenants can apply
  if (user.role !== "tenant") {
    throw new Error("Only tenants can submit applications");
  }

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    message: formData.get("message"),
  };

  const parsed = applicationSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  // Verify the property exists before creating anything
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true },
  });

  if (!property) throw new Error("Property not found");

  // Check the tenant hasn't already applied to this property
  const existing = await prisma.application.findFirst({
    where: { propertyId, tenantUserId: user.id },
  });

  if (existing) throw new Error("You have already applied to this property");

  const application = await prisma.application.create({
    data: {
      applicationDate: new Date(),
      status: "Pending",
      name: parsed.data.name,
      email: parsed.data.email,
      phoneNumber: parsed.data.phoneNumber,
      message: parsed.data.message,
      property: { connect: { id: propertyId } },
      tenant: { connect: { userId: user.id } },
    },
    include: { property: true, tenant: true },
  });

  revalidatePath("/applications");
  return application;
}

/**
 * updateApplicationStatus → was PUT /applications/:id/status
 * Only managers can approve or deny applications.
 *
 * Key differences from Express:
 *  - The Express version does 4 separate DB calls sequentially outside a
 *    transaction (findUnique, create lease, update property, update application)
 *    meaning a failure halfway leaves the DB in a partial state.
 *    We wrap the entire Approved flow in a transaction for atomicity.
 *  - The final re-fetch is removed — we return the updated data from
 *    within the transaction directly.
 *  - Validates that the manager owns the property being acted on,
 *    so a manager can't approve applications on another manager's property.
 */
export async function updateApplicationStatus(
  applicationId: number,
  status: ApplicationStatus,
) {
  const user = await requireManager();

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      property: true,
      tenant: true,
    },
  });

  if (!application) throw new Error("Application not found");

  // Guard: manager can only act on their own properties
  if (application.property.managerUserId !== user.id) {
    throw new Error("You do not have permission to update this application");
  }

  if (status === "Approved") {
    // All three writes in one transaction — all succeed or all roll back
    const updated = await prisma.$transaction(async (tx) => {
      // Create the lease now that the application is approved
      const lease = await tx.lease.create({
        data: {
          startDate: new Date(),
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ),
          rent: application.property.pricePerMonth,
          deposit: application.property.securityDeposit,
          property: { connect: { id: application.propertyId } },
          tenant: { connect: { userId: application.tenantUserId } },
        },
      });

      // Connect the tenant to the property (marks them as a current resident)
      await tx.property.update({
        where: { id: application.propertyId },
        data: {
          tenants: { connect: { userId: application.tenantUserId } },
        },
      });

      // Update the application status and link the new lease
      return tx.application.update({
        where: { id: applicationId },
        data: { status, leaseId: lease.id },
        include: {
          property: true,
          tenant: true,
          lease: true,
        },
      });
    });

    revalidatePath("/applications");
    revalidatePath("/dashboard");

    return {
      ...updated,
      lease: updated.lease
        ? {
            ...updated.lease,
            nextPaymentDate: calculateNextPaymentDate(updated.lease.startDate),
          }
        : null,
    };
  }

  // Denied or any other status — simple update, no lease needed
  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
    include: { property: true, tenant: true, lease: true },
  });

  revalidatePath("/applications");
  return updated;
}
