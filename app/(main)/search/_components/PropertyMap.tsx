"use client";

import { Badge } from "@/components/ui/badge";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  useMap,
} from "@/components/ui/map";
import { useMapCenter } from "@/hooks/use-map-center";
import { PropertiesType } from "@/lib/queries/property.queries";
import { Bath, BedDouble, MapPin } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

/**
 * Child component that lives inside <Map> so it has access to
 * the MapLibre instance via useMap(). Calls flyTo when
 * center/zoom change.
 */
const MapFlyController = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const { map, isLoaded } = useMap();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip the initial mount — the map already starts at the right position
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!map || !isLoaded) return;

    map.flyTo({
      center: center,
      zoom: zoom,
      duration: 1500,
      essential: true,
    });
  }, [map, isLoaded, center, zoom]);

  return null;
};

const PropertyMap = ({ properties }: { properties: PropertiesType }) => {
  const center = useMapCenter();
  const searchParams = useSearchParams();

  const zoom = useMemo(() => {
    return searchParams.get("coordinates") ? 12 : 9;
  }, [searchParams]);

  return (
    <div className="relative hidden grow overflow-hidden rounded-xl md:block md:h-115 md:basis-1/2 lg:h-full lg:basis-7/12">
      <Map center={center} zoom={zoom} className="rounded-xl">
        <MapFlyController center={center} zoom={zoom} />

        <MapControls
          position="bottom-right"
          showZoom
          showLocate
          showFullscreen
        />
        {properties.map((property) => (
          <MapMarker
            key={property.id}
            longitude={property.location.longitude}
            latitude={property.location.latitude}
          >
            <MarkerContent>
              <div className="group bg-primary-foreground text-primary relative flex size-8 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 hover:shadow-xl">
                <MapPin className="size-6" strokeWidth={2.5} />
              </div>
            </MarkerContent>

            <MarkerPopup>
              <div className="w-64 overflow-hidden rounded-lg">
                {property.photoUrls[0] && (
                  <div
                    className="h-36 w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${property.photoUrls[0]})` }}
                  />
                )}
                <div className="space-y-2 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/properties/${property.id}`}
                      target="_blank"
                      className="hover:text-primary-700 text-sm leading-tight font-semibold text-gray-900 hover:underline"
                    >
                      {property.name}
                    </Link>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {property.propertyType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">
                      {property.location.address}, {property.location.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-3 w-3" />
                      {property.beds} bed{property.beds !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      {property.baths} bath{property.baths !== 1 ? "s" : ""}
                    </span>
                    <span>{property.squareFeet.toLocaleString()} sqft</span>
                  </div>
                  <div className="border-t pt-1">
                    <span className="text-primary-700 text-sm font-bold">
                      ${property.pricePerMonth.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400"> / month</span>
                  </div>
                </div>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
};

export default PropertyMap;
