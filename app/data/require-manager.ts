import { forbidden, unauthorized } from "next/navigation";
import { cache } from "react";
import "server-only";
import { getServerSession } from "./get-session";

export const requireManager = cache(async () => {
  const session = await getServerSession();

  if (!session) unauthorized();
  if (session.user.role !== "manager") forbidden();

  return session.user;
});
