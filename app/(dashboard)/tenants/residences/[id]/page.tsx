import { getAuthUser } from "@/app/data/get-auth-user";
import { getLeasePayments, getLeases } from "@/lib/queries/lease.queries";
import { getProperty } from "@/lib/queries/property.queries";
import BillingHistory from "./_components/BillingHistory";
import PaymentMethod from "./_components/PaymentMethod";
import ResidenceCard from "./_components/ResidenceCard";

const ResidenceDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const property = await getProperty(Number(id));
  const user = await getAuthUser();
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
