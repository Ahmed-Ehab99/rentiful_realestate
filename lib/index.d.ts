import { MotionProps as OriginalMotionProps } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Application, Manager, Tenant } from "./prismaTypes";
import { TenantType } from "./queries/tenant.queries";

declare module "framer-motion" {
  interface MotionProps extends OriginalMotionProps {
    className?: string;
  }
}

declare global {
  interface SidebarLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
  }

  interface PropertyOverviewProps {
    propertyId: number;
  }

  interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: number;
  }

  interface ContactWidgetProps {
    onOpenModal: () => void;
  }

  interface ImagePreviewsProps {
    images: string[];
  }

  interface PropertyDetailsProps {
    propertyId: number;
  }

  interface PropertyOverviewProps {
    propertyId: number;
  }

  interface PropertyLocationProps {
    propertyId: number;
  }

  interface ApplicationCardProps {
    application: Application;
    userType: "manager" | "renter";
    children: React.ReactNode;
  }

  interface CardCompactProps {
    property: TenantType["favorites"][0];
    isFavorite: boolean;
    onFavoriteToggle: () => void;
    showFavoriteButton?: boolean;
    propertyLink?: string;
  }

  interface NavbarProps {
    isDashboard: boolean;
  }

  interface AppSidebarProps {
    userType: "manager" | "tenant";
  }

  interface SettingsFormProps {
    initialData: SettingsFormData;
    userType: "manager" | "tenant";
  }

  type UserRole = "tenant" | "manager";

  interface AuthUserResponse {
    userInfo: Tenant | Manager;
    userRole: "tenant" | "manager";
  }

  interface UpdateSettingsPayload {
    userId: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
  }
}

export {};
