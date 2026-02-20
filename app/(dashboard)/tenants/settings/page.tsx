import { getSettingsData } from "@/lib/actions/setting.actions";
import SettingsForm from "../../_components/SettingsForm";

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
