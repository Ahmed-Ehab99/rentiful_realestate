import { getAuthUser } from "@/app/data/get-auth-user";
import Header from "../../_components/Header";
import NewPropertyForm from "./_components/NewPropertyForm";

const NewPropertyPage = async () => {
  const user = await getAuthUser();

  return (
    <>
      <Header
        title="Add New Property"
        subtitle="Create a new property listing with detailed information"
      />

      <NewPropertyForm user={user} />
    </>
  );
};

export default NewPropertyPage;
