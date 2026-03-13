import { getAuthUser } from "@/app/data/get-auth-user";
import { getProperty } from "@/lib/queries/property.queries";
import ImagePreviews from "./_components/ImagePreviews";
import PropertyDetails from "./_components/PropertyDetails";
import PropertyLocation from "./_components/PropertyLocation";
import PropertyOverview from "./_components/PropertyOverview";
import TenantApplication from "./_components/TenantApplication";

const PropertyDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: number }>;
}) => {
  const { id } = await params;
  const property = await getProperty(Number(id));
  const user = await getAuthUser();

  return (
    <>
      <ImagePreviews images={property.photoUrls} />
      <div className="mx-10 mt-16 mb-8 flex flex-col justify-center gap-10 md:mx-auto md:w-2/3 md:flex-row">
        <div className="order-2 md:order-1">
          <PropertyOverview property={property} />
          <PropertyDetails property={property} />
          <PropertyLocation property={property} />
        </div>

        <div className="order-1 md:order-2">
          <TenantApplication property={property} user={user} />
        </div>
      </div>
    </>
  );
};

export default PropertyDetailsPage;
