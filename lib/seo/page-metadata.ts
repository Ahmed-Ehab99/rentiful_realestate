import type { Metadata } from "next";
import type { PropertySingularType } from "@/lib/queries/property.queries";

export const DEFAULT_OG_IMAGE = "/opengraph-image.png";

type PageMetaInput = {
  title: string;
  description: string;
  /** App-relative path (e.g. `/search`) or absolute image URL */
  image?: string;
  /** Dashboard / account pages — avoid indexing private UI in search engines */
  noIndex?: boolean;
};

function truncateMeta(text: string, max: number) {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Static page metadata with Open Graph and Twitter cards.
 * Relies on root `metadataBase` for relative image URLs.
 */
export function createPageMetadata({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: PageMetaInput): Metadata {
  const images = [{ url: image, width: 1200, height: 630, alt: title }];

  return {
    title,
    description,
    ...(noIndex && {
      robots: { index: false, follow: true } satisfies Metadata["robots"],
    }),
    openGraph: {
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function createPropertyListingMetadata(
  property: PropertySingularType,
): Metadata {
  const loc = property.location;
  const locationStr = loc ? `${loc.city}, ${loc.state}` : "Rental listing";
  const title = `${property.name} — ${locationStr}`;
  const description = truncateMeta(
    `${property.description} $${Math.round(property.pricePerMonth)}/mo · ${locationStr}`,
    155,
  );
  const image = property.photoUrls[0] ?? DEFAULT_OG_IMAGE;

  return createPageMetadata({ title, description, image });
}

export function createResidenceMetadata(
  property: PropertySingularType,
): Metadata {
  const loc = property.location;
  const locationStr = loc ? `${loc.city}, ${loc.state}` : "";
  const title = `My residence — ${property.name}`;
  const description = truncateMeta(
    `Your lease and payments for ${property.name}${locationStr ? ` in ${locationStr}` : ""}.`,
    155,
  );
  const image = property.photoUrls[0] ?? DEFAULT_OG_IMAGE;

  return createPageMetadata({
    title,
    description,
    image,
    noIndex: true,
  });
}

export function createManagerPropertyMetadata(
  property: PropertySingularType,
): Metadata {
  const loc = property.location;
  const locationStr = loc ? `${loc.city}, ${loc.state}` : "";
  const title = `Manage ${property.name}`;
  const description = truncateMeta(
    `Tenants and leases for ${property.name}${locationStr ? ` · ${locationStr}` : ""}.`,
    155,
  );
  const image = property.photoUrls[0] ?? DEFAULT_OG_IMAGE;

  return createPageMetadata({
    title,
    description,
    image,
    noIndex: true,
  });
}
