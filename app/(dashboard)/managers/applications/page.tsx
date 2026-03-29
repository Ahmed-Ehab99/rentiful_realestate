import { getServerSession } from "@/app/data/get-session";
import { listApplications } from "@/lib/queries/application.queries";
import { forbidden, unauthorized } from "next/navigation";
import Header from "../../_components/Header";
import ApplicationsTabs from "./_components/ApplicationsTabs";

const ApplicationsPage = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();
  if (user.role !== "manager") forbidden();

  const applications = await listApplications(user.id, user.role);

  return (
    <>
      <Header
        title="Applications"
        subtitle="View and manage applications for your properties"
      />
      <ApplicationsTabs applications={applications} />
    </>
  );
};

export default ApplicationsPage;
