/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { requireManager } from "@/app/data/require-manager";
import { prisma } from "@/lib/db";
import { propertySchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

/**
 * createProperty → was POST /properties
 *
 * Key differences from Express:
 *  - Photos are already uploaded to Tigris by the client via presigned URLs
 *    (from /api/s3/upload) — we just receive the resulting public URLs as strings.
 *    No Multer, no server-side S3 upload here.
 *  - No PostGIS raw SQL for location — plain lat/lng Floats via prisma.location.create()
 *  - managerUserId comes from the session, never from the request body
 *  - Location + property created in a transaction for atomicity
 */
export async function createProperty(formData: FormData) {
  const user = await requireManager();

  // photoUrls are sent as multiple FormData entries after the client
  // has already uploaded each file to Tigris and received back the public URLs
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    pricePerMonth: formData.get("pricePerMonth"),
    securityDeposit: formData.get("securityDeposit"),
    applicationFee: formData.get("applicationFee"),
    isPetsAllowed: formData.get("isPetsAllowed") === "true",
    isParkingIncluded: formData.get("isParkingIncluded") === "true",
    amenities: formData.get("amenities"),
    highlights: formData.get("highlights"),
    beds: formData.get("beds"),
    baths: formData.get("baths"),
    squareFeet: formData.get("squareFeet"),
    propertyType: formData.get("propertyType"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    country: formData.get("country"),
    postalCode: formData.get("postalCode"),
    // These are already-uploaded Tigris public URLs, not File objects
    photoUrls: formData.getAll("photoUrls") as string[],
  };

  const parsed = propertySchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const data = parsed.data;

  // Geocode address → lat/lng via Nominatim (free, no API key)
  // next: { revalidate: 86400 } caches the result for 24h —
  // same address always returns the same coordinates
  const geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
    {
      street: data.address,
      city: data.city,
      country: data.country,
      postalcode: data.postalCode,
      format: "json",
      limit: "1",
    },
  )}`;

  const geocodingRes = await fetch(geocodingUrl, {
    headers: { "User-Agent": "RentalApp/1.0" },
    next: { revalidate: 86400 },
  });

  const geocodingJson = await geocodingRes.json();
  const latitude = parseFloat(geocodingJson[0]?.lat ?? "0");
  const longitude = parseFloat(geocodingJson[0]?.lon ?? "0");

  // Wrap in a transaction — if property creation fails, location is rolled back too
  const property = await prisma.$transaction(async (tx) => {
    const location = await tx.location.create({
      data: {
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        latitude,
        longitude,
      },
    });

    return tx.property.create({
      data: {
        name: data.name,
        description: data.description,
        pricePerMonth: data.pricePerMonth,
        securityDeposit: data.securityDeposit,
        applicationFee: data.applicationFee,
        isPetsAllowed: data.isPetsAllowed,
        isParkingIncluded: data.isParkingIncluded,
        amenities: data.amenities.split(",") as any,
        highlights: data.highlights.split(",") as any,
        beds: data.beds,
        baths: data.baths,
        squareFeet: data.squareFeet,
        propertyType: data.propertyType,
        // Already-uploaded Tigris URLs, stored directly
        photoUrls: data.photoUrls as string[],
        locationId: location.id,
        // Always from session — never trust the client for this
        managerUserId: user.id,
      },
      include: { location: true, manager: true },
    });
  });

  revalidatePath("/properties");
  revalidatePath("/dashboard");

  return property;
}
