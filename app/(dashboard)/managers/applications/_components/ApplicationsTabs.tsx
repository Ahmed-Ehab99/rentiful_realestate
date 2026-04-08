"use client";

import ApplicationCard from "@/components/ApplicationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateApplicationStatus } from "@/lib/actions/application.actions";
import { ApplicationsType } from "@/lib/queries/application.queries";
import { ApplicationStatus } from "@/prisma/generated/prisma/enums";
import { CircleCheckBig, Download, File, Hospital } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

const ApplicationsTabs = ({
  applications,
}: {
  applications: ApplicationsType;
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [isPending, startTransition] = useTransition();

  // ✅ Only track WHICH button was clicked (not loading state itself)
  const [activeAction, setActiveAction] = useState<{
    id: number | null;
    action: "Approved" | "Denied" | null;
  }>({ id: null, action: null });

  const handleStatusChange = (id: number, status: ApplicationStatus) => {
    setActiveAction({ id, action: status as "Approved" | "Denied" });

    startTransition(async () => {
      try {
        await updateApplicationStatus(id, status);
      } catch (error) {
        console.error("Failed to update application status:", error);
      } finally {
        setActiveAction({ id: null, action: null });
      }
    });
  };

  const filteredApplications = applications?.filter((application) => {
    if (activeTab === "all") return true;
    return application.status.toLowerCase() === activeTab;
  });

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="my-5 w-full"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="denied">Denied</TabsTrigger>
      </TabsList>
      {["all", "pending", "approved", "denied"].map((tab) => (
        <TabsContent key={tab} value={tab} className="mt-5 w-full">
          {filteredApplications
            .filter(
              (application) =>
                tab === "all" || application.status.toLowerCase() === tab,
            )
            .map((application) => {
              const isThisLoading =
                isPending && activeAction.id === application.id;

              return (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  userType="manager"
                >
                  <div className="flex w-full justify-between gap-5 px-4 pb-4">
                    {/* Colored Section Status */}
                    <div
                      className={`grow p-4 text-green-700 ${
                        application.status === "Approved"
                          ? "bg-green-100"
                          : application.status === "Denied"
                            ? "bg-red-100"
                            : "bg-yellow-100"
                      }`}
                    >
                      <div className="flex flex-wrap items-center">
                        <File className="mr-2 h-5 w-5 shrink-0" />
                        <span className="mr-2">
                          Application submitted on{" "}
                          {new Date(
                            application.applicationDate,
                          ).toLocaleDateString()}
                          .
                        </span>
                        <CircleCheckBig className="mr-2 h-5 w-5 shrink-0" />
                        <span
                          className={`font-semibold ${
                            application.status === "Approved"
                              ? "text-green-800"
                              : application.status === "Denied"
                                ? "text-red-800"
                                : "text-yellow-800"
                          }`}
                        >
                          {application.status === "Approved" &&
                            "This application has been approved."}
                          {application.status === "Denied" &&
                            "This application has been denied."}
                          {application.status === "Pending" &&
                            "This application is pending review."}
                        </span>
                      </div>
                    </div>

                    {/* Right Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/managers/properties/${application.property.id}`}
                        className="hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700"
                        scroll={false}
                        prefetch
                      >
                        <Hospital className="mr-2 h-5 w-5" />
                        Property Details
                      </Link>
                      {application.status === "Approved" && (
                        <button className="hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700">
                          <Download className="mr-2 h-5 w-5" />
                          Download Agreement
                        </button>
                      )}
                      {application.status === "Pending" && (
                        <>
                          <button
                            className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() =>
                              handleStatusChange(application.id, "Approved")
                            }
                            disabled={isPending}
                          >
                            {isThisLoading &&
                            activeAction.action === "Approved" ? (
                              <>
                                <Spinner className="size-4" />
                                Approving...
                              </>
                            ) : (
                              "Approve"
                            )}
                          </button>

                          <button
                            className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() =>
                              handleStatusChange(application.id, "Denied")
                            }
                            disabled={isPending}
                          >
                            {isThisLoading &&
                            activeAction.action === "Denied" ? (
                              <>
                                <Spinner className="size-4" />
                                Denying...
                              </>
                            ) : (
                              "Deny"
                            )}
                          </button>
                        </>
                      )}
                      {application.status === "Denied" && (
                        <button className="hover:bg-secondary-500 hover:text-primary-50 flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-white">
                          Contact User
                        </button>
                      )}
                    </div>
                  </div>
                </ApplicationCard>
              );
            })}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ApplicationsTabs;

export const ApplicationTabsSkeleton = () => {
  return (
    <div className="my-5 flex w-full flex-col gap-2">
      <Skeleton className="h-9 w-full" />
      <div className="mt-5">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="mb-4 h-85.5 w-full" />
        ))}
      </div>
    </div>
  );
};
