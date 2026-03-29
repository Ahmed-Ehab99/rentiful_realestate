import { getServerSession } from "@/app/data/get-session";
import Header from "../../_components/Header";
import NewPropertyForm from "./_components/NewPropertyForm";
import { forbidden, unauthorized } from "next/navigation";

const NewPropertyPage = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();
  if (user.role !== "manager") forbidden();

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
