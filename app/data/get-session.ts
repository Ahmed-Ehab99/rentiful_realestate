import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";
import "server-only";

export const getServerSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() });
});
