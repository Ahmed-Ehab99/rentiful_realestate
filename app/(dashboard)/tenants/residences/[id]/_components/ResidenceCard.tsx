import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { LeasesType } from "@/lib/queries/lease.queries";
import { PropertySingularType } from "@/lib/queries/property.queries";
import { Download, MapPin, User } from "lucide-react";
import Image from "next/image";

const ResidenceCard = ({
  property,
  currentLease,
}: {
  property: PropertySingularType;
  currentLease: LeasesType[0];
}) => {
  return (
    <div className="flex flex-1 flex-col justify-between overflow-hidden rounded-xl bg-white p-6 shadow-md">
      {/* Header */}
      <div className="flex gap-5">
        <Carousel className="max-w-60">
          <CarouselContent>
            {property.photoUrls.map((imgSrc) => (
              <CarouselItem key={imgSrc}>
                <Image
                  src={imgSrc}
                  alt={property.name}
                  width={256}
                  height={128}
                  className="w-full rounded-xl"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>

        <div className="flex flex-col justify-between">
          <div>
            <div className="w-fit rounded-full bg-green-500 px-4 py-1 text-sm font-semibold text-white">
              Active Leases
            </div>

            <h2 className="my-2 text-2xl font-bold">{property.name}</h2>
            <div className="mb-2 flex items-center">
              <MapPin className="mr-1 h-5 w-5" />
              <span>
                {property.location.city}, {property.location.country}
              </span>
            </div>
          </div>
          <div className="text-xl font-bold">
            ${currentLease.rent}{" "}
            <span className="text-sm font-normal text-gray-500">/ night</span>
          </div>
        </div>
      </div>
      {/* Dates */}
      <div>
        <hr className="my-4" />
        <div className="flex items-center justify-between">
          <div className="xl:flex">
            <div className="mr-2 text-gray-500">Start Date: </div>
            <div className="font-semibold">
              {new Date(currentLease.startDate).toLocaleDateString()}
            </div>
          </div>
          <div className="border-primary-300 h-4 border-[0.5px]" />
          <div className="xl:flex">
            <div className="mr-2 text-gray-500">End Date: </div>
            <div className="font-semibold">
              {new Date(currentLease.endDate).toLocaleDateString()}
            </div>
          </div>
          <div className="border-primary-300 h-4 border-[0.5px]" />
          <div className="xl:flex">
            <div className="mr-2 text-gray-500">Next Payment: </div>
            <div className="font-semibold">
              {new Date(currentLease.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>
        <hr className="my-4" />
      </div>
      {/* Buttons */}
      <div className="flex w-full justify-end gap-2">
        <Button
          variant="outline"
          className="hover:bg-primary-700 hover:text-primary-50"
        >
          <User className="size-5" />
          Manager
        </Button>
        <Button
          variant="outline"
          className="hover:bg-primary-700 hover:text-primary-50"
        >
          <Download className="size-5" />
          Download Agreement
        </Button>
      </div>
    </div>
  );
};

export default ResidenceCard;
