import { forbidden, unauthorized } from "next/navigation";
import { cache } from "react";
import "server-only";
import { getServerSession } from "./get-session";

export const requireTenant = cache(async () => {
  const session = await getServerSession();

  if (!session) unauthorized();
  if (session.user.role !== "tenant") forbidden();

  return session.user;
});
