"use client";

import { User } from "@/lib/auth-client";
import { PropertySingularType } from "@/lib/queries/property.queries";
import { useState } from "react";
import ApplicationModal from "./ApplicationModal";
import ContactWidget from "./ContactWidget";

interface TenantApplicationProps {
  property: PropertySingularType;
  user: User;
}

const TenantApplication = ({ property, user }: TenantApplicationProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ContactWidget onOpenModal={() => setIsModalOpen(true)} />
      {user && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          property={property}
          user={user}
        />
      )}
    </>
  );
};

export default TenantApplication;
