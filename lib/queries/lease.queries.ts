import { prisma } from "@/lib/db";

/**
 * getLeases → was GET /leases
 *
 * The Express version fetches ALL leases globally with no auth check —
 * likely only used internally or by an admin view.
 * We scope it to the current user so a tenant only sees their own leases
 * and a manager only sees leases on their properties.
 */
export async function getLeases(
  userId: string,
  userType: "tenant" | "manager",
) {
  const where =
    userType === "tenant"
      ? { tenantUserId: userId }
      : { property: { managerUserId: userId } };

  const leases = await prisma.lease.findMany({
    where,
    include: {
      tenant: true,
      property: { include: { location: true } },
      payments: {
        orderBy: { dueDate: "asc" },
      },
    },
    orderBy: { startDate: "desc" },
  });

  return leases;
}

/**
 * getLeasePayments → was GET /leases/:id/payments
 *
 * Added an ownership check the Express version was missing —
 * verifies the lease belongs to the requesting user before
 * returning payment data.
 */
export async function getLeasePayments(
  leaseId: number,
  userId: string,
  userType: "tenant" | "manager",
) {
  // Verify the lease belongs to this user before exposing payment data
  const lease = await prisma.lease.findUnique({
    where: { id: leaseId },
    include: { property: true },
  });

  if (!lease) return null;

  const isOwner =
    userType === "tenant"
      ? lease.tenantUserId === userId
      : lease.property.managerUserId === userId;

  if (!isOwner) throw new Error("Unauthorized");

  const payments = await prisma.payment.findMany({
    where: { leaseId },
    orderBy: { dueDate: "asc" },
  });

  return payments;
}
