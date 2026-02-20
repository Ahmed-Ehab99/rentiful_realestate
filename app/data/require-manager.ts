import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import "server-only";

export const requireManager = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/signup");
  }

  if (session.user.role !== "manager") {
    return redirect("/signup");
  }

  return session.user;
});
