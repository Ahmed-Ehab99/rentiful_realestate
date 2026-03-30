import { getServerSession } from "@/app/data/get-session";
import { listApplications } from "@/lib/queries/application.queries";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { forbidden, unauthorized } from "next/navigation";
import { Suspense } from "react";
import Header from "../../_components/Header";
import ApplicationsTabs, {
  ApplicationTabsSkeleton,
} from "./_components/ApplicationsTabs";

export const metadata = createPageMetadata({
  title: "Renter applications",
  description:
    "Review and manage applications submitted to your rental properties on Rentiful.",
  noIndex: true,
});

const ApplicationsPage = () => {
  return (
    <>
      <Header
        title="Applications"
        subtitle="View and manage applications for your properties"
      />
      <Suspense fallback={<ApplicationTabsSkeleton />}>
        <RenderApplication />
      </Suspense>
    </>
  );
};

export default ApplicationsPage;

const RenderApplication = async () => {
  const session = await getServerSession();
  const user = session?.user;
  if (!user) unauthorized();
  if (user.role !== "manager") forbidden();
  const applications = await listApplications(user.id, user.role);

  return <ApplicationsTabs applications={applications} />;
};
