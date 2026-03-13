"use client";

import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
} from "@/components/ui/map";
import { PropertySingularType } from "@/lib/queries/property.queries";
import { Compass, MapPin } from "lucide-react";

const PropertyLocation = ({ property }: { property: PropertySingularType }) => {
  const hasCoordinates =
    !!property.location &&
    typeof property.location.latitude === "number" &&
    typeof property.location.longitude === "number";

  return (
    <div className="py-10">
      <h3 className="text-primary-800 dark:text-primary-100 text-xl font-semibold">
        Map and Location
      </h3>
      <div className="text-primary-500 mt-2 flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-500">
          <MapPin className="mr-1 h-4 w-4 text-gray-700" />
          Property Address:
          <span className="ml-2 font-semibold text-gray-700">
            {property.location?.address || "Address not available"}
          </span>
        </div>
        {property.location?.address && (
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(
              property.location.address,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 flex items-center justify-between gap-2 hover:underline"
          >
            <Compass className="h-5 w-5" />
            Get Directions
          </a>
        )}
      </div>

      <div className="relative mt-4 h-[300px] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        {hasCoordinates ? (
          <Map
            center={[property.location!.longitude, property.location!.latitude]}
            zoom={14}
            className="h-full w-full"
          >
            <MapControls
              position="bottom-right"
              showZoom
              showLocate
              showFullscreen
            />
            <MapMarker
              longitude={property.location!.longitude}
              latitude={property.location!.latitude}
            >
              <MarkerContent>
                <div className="bg-primary-foreground text-primary relative flex size-9 items-center justify-center rounded-full shadow-lg ring-2 ring-white/80">
                  <MapPin className="size-5" strokeWidth={2.5} />
                </div>
              </MarkerContent>
            </MapMarker>
          </Map>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Map location not available for this property.
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyLocation;
