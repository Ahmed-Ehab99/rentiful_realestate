import { Manager, Tenant } from "@/prisma/generated/prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  reducerPath: "api",
  tagTypes: ["AuthUser", "Properties", "Managers", "Tenants"],
  endpoints: (build) => ({
    getAuthUser: build.query<
      AuthUserResponse,
      { userId: string; userRole: UserRole }
    >({
      providesTags: ["AuthUser"],
      queryFn: async (
        { userId, userRole },
        _queryApi,
        _extraOptions,
        fetchWithBQ,
      ) => {
        const endpoint =
          userRole === "manager" ? `/managers/${userId}` : `/tenants/${userId}`;

        let profileResponse = await fetchWithBQ(endpoint);

        if (profileResponse.error && profileResponse.error.status === 404) {
          const createEndpoint =
            userRole === "manager" ? "/managers" : "/tenants";

          profileResponse = await fetchWithBQ({
            url: createEndpoint,
            method: "POST",
            body: { userId },
          });

          if (profileResponse.error) {
            return {
              error: {
                status: 500,
                data: "Failed to create user profile",
              },
            };
          }
        }

        if (profileResponse.error) {
          return { error: profileResponse.error };
        }

        return {
          data: {
            userInfo: profileResponse.data as Tenant | Manager,
            userRole,
          },
        };
      },
    }),
  }),
});

export const { useGetAuthUserQuery } = api;
