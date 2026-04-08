import { getServerSession } from "@/app/data/get-session";
import { getLeasePayments, getLeases } from "@/lib/queries/lease.queries";
import { getProperties, getProperty } from "@/lib/queries/property.queries";
import { createResidenceMetadata } from "@/lib/seo/page-metadata";
import type { Metadata } from "next";
import { forbidden, unauthorized } from "next/navigation";
import BillingHistory from "./_components/BillingHistory";
import PaymentMethod from "./_components/PaymentMethod";
import ResidenceCard from "./_components/ResidenceCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(Number(id));
  return createResidenceMetadata(property);
}

export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((property) => ({
    id: String(property.id),
  }));
}

const ResidenceDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();
  if (user.role !== "tenant") forbidden();

  const property = await getProperty(Number(id));
  const leases = await getLeases(user.id, user.role);
  const payments = await getLeasePayments(leases[0].id, user.id, user.role);

  const currentLease = leases?.find(
    (lease) => lease.propertyId === property.id,
  );

  return (
    <div className="mx-auto w-full">
      <div className="gap-10 md:flex">
        {currentLease && (
          <ResidenceCard property={property} currentLease={currentLease} />
        )}
        <PaymentMethod />
      </div>
      <BillingHistory payments={payments || []} />
    </div>
  );
};

export default ResidenceDetailsPage;
