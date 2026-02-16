import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";

// ─── Standard JSON response helpers ──────────────────────────────────────────

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function conflict(message = "Conflict") {
  return NextResponse.json({ error: message }, { status: 409 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message = "Internal server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export type UserRole = "tenant" | "manager";

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
}

/**
 * Retrieves and validates the current session from the incoming request.
 * Returns the session user or null if unauthenticated / unverified.
 *
 * Usage:
 *   const user = await getSessionUser();
 *   if (!user) return unauthorized();
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const role = session.user.role as UserRole;
  if (role !== "tenant" && role !== "manager") return null;

  return {
    id: session.user.id,
    email: session.user.email,
    role,
    emailVerified: session.user.emailVerified,
  };
}

/**
 * Ensures the authenticated user matches the userId in the route params,
 * preventing users from reading or mutating other users' data.
 *
 * Usage:
 *   const user = await requireSelf(params.userId);
 *   if (user instanceof NextResponse) return user; // 401 or 403
 */
export async function requireSelf(
  routeUserId: string,
): Promise<SessionUser | NextResponse> {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  if (user.id !== routeUserId) return forbidden();
  return user;
}

/**
 * Ensures the authenticated user has the expected role.
 *
 * Usage:
 *   const user = await requireRole("manager");
 *   if (user instanceof NextResponse) return user; // 401 or 403
 */
export async function requireRole(
  role: UserRole,
): Promise<SessionUser | NextResponse> {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  if (user.role !== role) return forbidden("Insufficient permissions");
  return user;
}

// ─── Input validation helper ──────────────────────────────────────────────────

/**
 * Parses and validates the request JSON body against a Zod schema.
 * Returns the parsed data or a 400 NextResponse with validation errors.
 *
 * Usage:
 *   const body = await parseBody(request, MySchema);
 *   if (body instanceof NextResponse) return body;
 */
export async function parseBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<T | NextResponse> {
  try {
    const json = await request.json();
    return schema.parse(json);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.flatten().fieldErrors },
        { status: 400 },
      );
    }
    return badRequest("Invalid JSON body");
  }
}

// ─── Route error boundary ─────────────────────────────────────────────────────

/**
 * Wraps a route handler in a try-catch that returns a 500 on unexpected errors.
 * Logs the error server-side with context for observability.
 *
 * Usage:
 *   export const GET = withErrorBoundary("GET /api/tenants/[userId]", async (req) => {
 *     ...
 *   });
 */
export function withErrorBoundary(
  context: string,
  handler: (req: Request, ctx: unknown) => Promise<NextResponse>,
) {
  return async (req: Request, ctx: unknown): Promise<NextResponse> => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`[${context}] Unhandled error:`, message, err);
      return serverError();
    }
  };
}
