import { getServerSession } from "@/app/data/get-session";
import { getProperties, getProperty } from "@/lib/queries/property.queries";
import { createPropertyListingMetadata } from "@/lib/seo/page-metadata";
import type { Metadata } from "next";
import { unauthorized } from "next/navigation";
import ImagePreviews from "./_components/ImagePreviews";
import PropertyDetails from "./_components/PropertyDetails";
import PropertyLocation from "./_components/PropertyLocation";
import PropertyOverview from "./_components/PropertyOverview";
import TenantApplication from "./_components/TenantApplication";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(Number(id));
  return createPropertyListingMetadata(property);
}

export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((property) => ({
    id: String(property.id),
  }));
}

const PropertyDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  const property = await getProperty(Number(id));

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
