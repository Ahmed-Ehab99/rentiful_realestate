import Header from "@/app/(dashboard)/_components/Header";
import { getServerSession } from "@/app/data/get-session";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLeasePayments, getLeases } from "@/lib/queries/lease.queries";
import { getProperties, getProperty } from "@/lib/queries/property.queries";
import { createManagerPropertyMetadata } from "@/lib/seo/page-metadata";
import { ArrowDownToLine, Check, Download } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { forbidden, unauthorized } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(Number(id));
  return createManagerPropertyMetadata(property);
}

export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((property) => ({
    id: String(property.id),
  }));
}

const PropertyTenantsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const property = await getProperty(Number(id));
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();
  if (user.role !== "manager") forbidden();

  const leases = await getLeases(user.id, user.role);
  const payments = await getLeasePayments(leases[0].id, user.id, user.role);

  const getCurrentMonthPaymentStatus = (leaseId: number) => {
    const currentDate = new Date();
    const currentMonthPayment = payments?.find(
      (payment) =>
        payment.leaseId === leaseId &&
        new Date(payment.dueDate).getMonth() === currentDate.getMonth() &&
        new Date(payment.dueDate).getFullYear() === currentDate.getFullYear(),
    );
    return currentMonthPayment?.paymentStatus || "Not Paid";
  };

  return (
    <>
      <Header
        title={property?.name || "My Property"}
        subtitle="Manage tenants and leases for this property"
      />

      <div className="w-full space-y-6">
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="mb-1 text-2xl font-bold">Tenants Overview</h2>
              <p className="text-sm text-gray-500">
                Manage and view all tenants for this property.
              </p>
            </div>
            <div>
              <Button
                variant="outline"
                className="hover:bg-primary-700 hover:text-primary-50"
              >
                <Download className="size-5" />
                <span>Download All</span>
              </Button>
            </div>
          </div>
          <hr className="mt-4 mb-1" />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Lease Period</TableHead>
                  <TableHead>Monthly Rent</TableHead>
                  <TableHead>Current Month Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leases?.map((lease) => (
                  <TableRow key={lease.id} className="h-24">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          src="/landing-i1.png"
                          alt={lease.tenant.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <div className="font-semibold">
                            {lease.tenant.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lease.tenant.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {new Date(lease.startDate).toLocaleDateString()} -
                      </div>
                      <div>{new Date(lease.endDate).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>${lease.rent.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          getCurrentMonthPaymentStatus(lease.id) === "Paid"
                            ? "border-green-300 bg-green-100 text-green-800"
                            : "border-red-300 bg-red-100 text-red-800"
                        }`}
                      >
                        {getCurrentMonthPaymentStatus(lease.id) === "Paid" && (
                          <Check className="mr-1 inline-block h-4 w-4" />
                        )}
                        {getCurrentMonthPaymentStatus(lease.id)}
                      </span>
                    </TableCell>
                    <TableCell>{lease.tenant.phoneNumber}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="hover:bg-primary-700 hover:text-primary-50"
                      >
                        <ArrowDownToLine className="size-4" />
                        Download Agreement
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyTenantsPage;
