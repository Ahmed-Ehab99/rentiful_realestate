import { getAuthUser } from "@/app/data/get-auth-user";
import { listApplications } from "@/lib/queries/application.queries";
import Header from "../../_components/Header";
import ApplicationsTabs from "./_components/ApplicationsTabs";

const ApplicationsPage = async () => {
  const user = await getAuthUser();
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
