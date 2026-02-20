import { prisma } from "@/lib/db";

/**
 * Calculates the next monthly payment date from a lease start date.
 * Extracted as a pure function — easy to test independently.
 * Keeps incrementing by one month until the date is in the future.
 */
export function calculateNextPaymentDate(startDate: Date): Date {
  const today = new Date();
  const nextPaymentDate = new Date(startDate);
  while (nextPaymentDate <= today) {
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  }
  return nextPaymentDate;
}

/**
 * listApplications → was GET /applications?userId=...&userType=...
 *
 * Key differences from Express:
 *  - userType is derived from session.user.role — never from query params.
 *    The caller passes userId + role from the session directly.
 *  - The N+1 lease query (one per application in a Promise.all loop) is
 *    replaced by a single query that fetches all relevant leases at once,
 *    then maps them in memory — much more efficient.
 */
export async function listApplications(
  userId: string,
  userType: "tenant" | "manager",
) {
  const where =
    userType === "tenant"
      ? { tenantUserId: userId }
      : { property: { managerUserId: userId } };

  const applications = await prisma.application.findMany({
    where,
    include: {
      property: {
        include: {
          location: true,
          manager: true,
        },
      },
      tenant: true,
      // Include the linked lease directly — no separate query needed
      // because Application already has a leaseId FK in your schema
      lease: true,
    },
    orderBy: { applicationDate: "desc" },
  });

  // Shape the response to match what the UI expects
  return applications.map((app) => ({
    ...app,
    property: {
      ...app.property,
      // Flatten address up to the top level for convenience
      address: app.property.location.address,
    },
    manager: app.property.manager,
    lease: app.lease
      ? {
          ...app.lease,
          nextPaymentDate: calculateNextPaymentDate(app.lease.startDate),
        }
      : null,
  }));
}
