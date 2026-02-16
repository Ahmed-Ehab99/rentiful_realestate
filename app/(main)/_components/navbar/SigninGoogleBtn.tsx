"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import GoogleImg from "@/public/google.svg";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";

const SigninGoogleBtn = () => {
  const [googlePending, startGoogleTransition] = useTransition();

  const signInWithGoogle = () => {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Google, you will be redirected...");
          },
          onError: () => {
            toast.error("Internal server error");
          },
        },
      });
    });
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      type="button"
      onClick={signInWithGoogle}
    >
      {googlePending ? (
        <Spinner className="size-6" />
      ) : (
        <Image
          src={GoogleImg}
          alt="Sign in with google"
          title="Sign in with google"
          className="size-6"
        />
      )}
    </Button>
  );
};

export default SigninGoogleBtn;
