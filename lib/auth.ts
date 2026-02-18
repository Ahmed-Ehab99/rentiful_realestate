import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import { prisma } from "./db";
import { env } from "./env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        input: true,
        defaultValue: "tenant",
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // auto-create username to user when creation
        before: async (user) => {
          let resolvedUsername = (user as Record<string, unknown>).username as
            | string
            | undefined;

          if (!resolvedUsername) {
            resolvedUsername = user.email
              .split("@")[0]
              .toLowerCase()
              .replace(/[^a-z0-9_]/g, "_")
              .slice(0, 15);
          }

          return {
            data: {
              ...user,
              username: resolvedUsername,
              role:
                ((user as Record<string, unknown>).role as string) ?? "tenant",
            },
          };
        },
        // auto-create the profile on user creation
        after: async (user) => {
          const role = user.role ?? "tenant";

          if (role === "manager") {
            await prisma.manager.create({
              data: {
                userId: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: "",
              },
            });
          } else {
            await prisma.tenant.create({
              data: {
                userId: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: "",
              },
            });
          }
        },
      },
    },
  },
  plugins: [username()],
  socialProviders: {
    google: {
      accessType: "offline",
      prompt: "select_account consent",
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});
