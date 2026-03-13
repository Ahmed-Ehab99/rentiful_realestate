import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AmenityIcons, HighlightIcons } from "@/lib/constants";
import { PropertySingularType } from "@/lib/queries/property.queries";
import { formatEnumString } from "@/lib/utils";
import { Amenity, Highlight } from "@/prisma/generated/prisma/enums";
import { HelpCircle } from "lucide-react";

const PropertyDetails = ({ property }: { property: PropertySingularType }) => {
  return (
    <div className="mb-6">
      {/* Amenities */}
      <div>
        <h2 className="my-3 text-xl font-semibold">Property Amenities</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {property.amenities.map((amenity: Amenity) => {
            const Icon = AmenityIcons[amenity] || HelpCircle;
            return (
              <div
                key={amenity}
                className="flex flex-col items-center rounded-xl border px-4 py-8"
              >
                <Icon className="mb-2 h-8 w-8 text-gray-700" />
                <span className="text-center text-sm text-gray-700">
                  {formatEnumString(amenity)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlights */}
      <div className="mt-12 mb-16">
        <h3 className="text-primary-800 dark:text-primary-100 text-xl font-semibold">
          Highlights
        </h3>
        <div className="mt-4 grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {property.highlights.map((highlight: Highlight) => {
            const Icon = HighlightIcons[highlight] || HelpCircle;
            return (
              <div
                key={highlight}
                className="flex flex-col items-center rounded-xl border px-4 py-8"
              >
                <Icon className="text-primary-600 dark:text-primary-300 mb-2 h-8 w-8" />
                <span className="text-primary-600 dark:text-primary-300 text-center text-sm">
                  {formatEnumString(highlight)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs Section */}
      <div>
        <h3 className="text-primary-800 dark:text-primary-100 mb-5 text-xl font-semibold">
          Fees and Policies
        </h3>
        <p className="text-primary-600 dark:text-primary-300 mt-2 text-sm">
          The fees below are based on community-supplied data and may exclude
          additional fees and utilities.
        </p>
        <Tabs defaultValue="required-fees" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="required-fees">Required Fees</TabsTrigger>
            <TabsTrigger value="pets">Pets</TabsTrigger>
            <TabsTrigger value="parking">Parking</TabsTrigger>
          </TabsList>
          <TabsContent value="required-fees" className="w-1/3">
            <p className="mt-5 mb-2 font-semibold">One time move in fees</p>
            <hr />
            <div className="bg-secondary-50 flex justify-between py-2">
              <span className="text-primary-700 font-medium">
                Application Fee
              </span>
              <span className="text-primary-700">
                ${property.applicationFee}
              </span>
            </div>
            <hr />
            <div className="bg-secondary-50 flex justify-between py-2">
              <span className="text-primary-700 font-medium">
                Security Deposit
              </span>
              <span className="text-primary-700">
                ${property.securityDeposit}
              </span>
            </div>
            <hr />
          </TabsContent>
          <TabsContent value="pets">
            <p className="mt-5 mb-2 font-semibold">
              Pets are {property.isPetsAllowed ? "allowed" : "not allowed"}
            </p>
          </TabsContent>
          <TabsContent value="parking">
            <p className="mt-5 mb-2 font-semibold">
              Parking is{" "}
              {property.isParkingIncluded ? "included" : "not included"}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyDetails;
