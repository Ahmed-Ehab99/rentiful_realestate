import SettingsForm from "../../_components/SettingsForm";
import { getSettingsData } from "../../actions";

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
