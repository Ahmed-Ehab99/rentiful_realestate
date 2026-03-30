import { getSettingsData } from "@/lib/actions/setting.actions";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import SettingsForm from "../../_components/SettingsForm";

export const metadata = createPageMetadata({
  title: "Account settings",
  description:
    "Update your Rentiful profile, contact details, and preferences as a renter.",
  noIndex: true,
});

const SettingsPage = async () => {
  const { userType, data } = await getSettingsData();

  return (
    <SettingsForm
      initialData={{
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
      }}
      userType={userType}
    />
  );
};

export default SettingsPage;
