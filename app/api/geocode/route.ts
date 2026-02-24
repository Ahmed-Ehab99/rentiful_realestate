import { NextRequest, NextResponse } from "next/server";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";

/**
 * Server-side geocoding proxy.
 *
 * If no query is provided, returns `{ lat: null, lng: null }` so the
 * client can clear the coordinates param and show all properties.
 *
 * @see https://operations.osmfoundation.org/policies/nominatim/
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  // No query → signal the client to clear coordinates (show all properties)
  if (!q || !q.trim()) {
    return NextResponse.json({
      lat: null,
      lng: null,
      displayName: null,
    });
  }

  const url = new URL(NOMINATIM_BASE);
  url.searchParams.set("q", q);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "1");

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "RentalApp/1.0 (https://localhost:3000; contact@rentalapp.com)",
        Referer: request.nextUrl.origin || "http://localhost:3000",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`Nominatim responded ${res.status}: ${text}`);
      return NextResponse.json(
        { error: `Geocoding service returned ${res.status}` },
        { status: 502 },
      );
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 },
      );
    }

    const { lat, lon, display_name } = data[0];

    return NextResponse.json({
      lat: Number(lat),
      lng: Number(lon),
      displayName: display_name,
    });
  } catch (err) {
    console.error("Geocoding fetch error:", err);
    return NextResponse.json(
      { error: "Failed to reach geocoding service" },
      { status: 500 },
    );
  }
}
