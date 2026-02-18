import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignout = () => {
  const router = useRouter();

  const handleSignout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully!");
            router.replace("/");
          },
        },
      });
    } catch {
      toast.error("Failed to signout, Please try again");
    }
  };

  return handleSignout;
};
