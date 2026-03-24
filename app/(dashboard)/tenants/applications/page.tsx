import { getAuthUser } from "@/app/data/get-auth-user";
import ApplicationCard from "@/components/ApplicationCard";
import EmptyState from "@/components/EmptyState";
import { listApplications } from "@/lib/queries/application.queries";
import { CircleCheckBig, Clock, Download, XCircle } from "lucide-react";
import Header from "../../_components/Header";

const ApplicationsPage = async () => {
  const user = await getAuthUser();
  const applications = await listApplications(user.id, user.role);
  console.log(applications);

  return (
    <>
      <Header
        title="Applications"
        subtitle="Track and manage your property rental applications"
      />
      <div className="w-full">
        {applications && applications.length > 0 ? (
          applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              userType="renter"
            >
              <div className="flex w-full justify-between gap-5 px-4 pb-4">
                {application.status === "Approved" ? (
                  <div className="flex grow items-center bg-green-100 p-4 text-green-700">
                    <CircleCheckBig className="mr-2 h-5 w-5" />
                    The property is being rented by you until{" "}
                    {application.lease?.endDate
                      ? new Date(application.lease.endDate).toLocaleDateString()
                      : "N/A"}
                  </div>
                ) : application.status === "Pending" ? (
                  <div className="flex grow items-center bg-yellow-100 p-4 text-yellow-700">
                    <Clock className="mr-2 h-5 w-5" />
                    Your application is pending approval
                  </div>
                ) : (
                  <div className="flex grow items-center bg-red-100 p-4 text-red-700">
                    <XCircle className="mr-2 h-5 w-5" />
                    Your application has been denied
                  </div>
                )}

                <button
                  className={`hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700`}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Agreement
                </button>
              </div>
            </ApplicationCard>
          ))
        ) : (
          <EmptyState
            Icon={Clock}
            title="No applications yet"
            description="You haven't applied to any properties yet. Start browsing available rentals to submit your first application."
            btnText="Browse Properties"
            btnHref="/search"
          />
        )}
      </div>
    </>
  );
};

export default ApplicationsPage;
