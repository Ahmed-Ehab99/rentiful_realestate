import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import SigninForm from "./_components/SigninForm";

const SigninPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md space-y-4">
        {/* Header */}
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Rentiful Logo"
              width={24}
              height={24}
              priority
              className="size-6 invert"
            />
            <h1 className="text-2xl font-bold">
              RENT
              <span className="text-secondary-500 hover:text-primary-300 font-light">
                IFUL
              </span>
            </h1>
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2 text-base">
            <span className="font-bold">Welcome!</span> Please sign in to
            continue
          </CardDescription>
        </CardHeader>

        {/* Form */}
        <SigninForm />

        {/* Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href="/signup"
            className="text-primary hover:text-primary/90 font-medium underline underline-offset-4"
          >
            Sign up here
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SigninPage;
