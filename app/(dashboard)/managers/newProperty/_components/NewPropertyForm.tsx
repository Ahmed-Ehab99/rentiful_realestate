"use client";

import Uploader from "@/components/file-uploader/Uploader";
import { CustomFormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { createProperty } from "@/lib/actions/property.actions";
import { User } from "@/lib/auth-client";
import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from "@/lib/constants";
import { PropertyFormData, propertyFormSchema } from "@/lib/schemas";
import { tryCatch } from "@/lib/try-catch";
import { constructUrl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

const defaultValues: PropertyFormData = {
  name: "",
  description: "",
  pricePerMonth: 1000,
  securityDeposit: 500,
  applicationFee: 100,
  isPetsAllowed: true,
  isParkingIncluded: true,
  photoUrls: [],
  amenities: [],
  highlights: [],
  beds: 1,
  baths: 1,
  squareFeet: 1000,
  propertyType: "" as PropertyFormData["propertyType"],
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

const NewPropertyForm = ({ user }: { user: User }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // Incrementing this remounts <Uploader />, clearing its internal file state
  // after a successful form reset — without any setState-during-render issues.
  const [uploaderKey, setUploaderKey] = useState(0);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues,
  });
  const photoUrls = useWatch({ control: form.control, name: "photoUrls" });

  const handlePhotoUrlsChange = useCallback(
    (keys: string[]) =>
      form.setValue("photoUrls", keys, { shouldValidate: true }),
    // form is stable from useForm — safe dep
    [form],
  );

  const onSubmit = async (data: PropertyFormData) => {
    if (!user.id) throw new Error("No manager ID found");

    startTransition(async () => {
      try {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (key === "photoUrls") {
            (value as string[]).forEach((k) => {
              const url = constructUrl(k);
              if (url) formData.append("photoUrls", url);
            });
          } else if (key === "amenities" || key === "highlights") {
            formData.append(key, (value as string[]).join(","));
          } else {
            formData.append(key, String(value));
          }
        });

        formData.append("managerUserId", user.id);

        const { error } = await tryCatch(createProperty(formData));

        if (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to create property",
          );
          return;
        }

        toast.success("Property created successfully!");
        form.reset(defaultValues);
        setUploaderKey((k) => k + 1);
        router.push("/managers/properties");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to create property",
        );
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 p-4">
        <div>
          <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
          <div className="space-y-4">
            <CustomFormField name="name" label="Property Name" />
            <CustomFormField
              name="description"
              label="Description"
              type="textarea"
            />
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="space-y-6">
          <h2 className="mb-4 text-lg font-semibold">Fees</h2>
          <CustomFormField
            name="pricePerMonth"
            label="Price per Month"
            type="number"
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CustomFormField
              name="securityDeposit"
              label="Security Deposit"
              type="number"
            />
            <CustomFormField
              name="applicationFee"
              label="Application Fee"
              type="number"
            />
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="space-y-6">
          <h2 className="mb-4 text-lg font-semibold">Property Details</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <CustomFormField name="beds" label="Number of Beds" type="number" />
            <CustomFormField
              name="baths"
              label="Number of Baths"
              type="number"
            />
            <CustomFormField
              name="squareFeet"
              label="Square Feet"
              type="number"
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <CustomFormField
              name="isPetsAllowed"
              label="Pets Allowed"
              type="switch"
            />
            <CustomFormField
              name="isParkingIncluded"
              label="Parking Included"
              type="switch"
            />
          </div>
          <div className="mt-4">
            <CustomFormField
              name="propertyType"
              label="Property Type"
              type="select"
              options={Object.keys(PropertyTypeEnum).map((type) => ({
                value: type,
                label: type,
              }))}
            />
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <div>
          <h2 className="mb-4 text-lg font-semibold">
            Amenities and Highlights
          </h2>
          <div className="space-y-6">
            <CustomFormField
              name="amenities"
              label="Amenities"
              type="multiselect"
              options={Object.keys(AmenityEnum).map((amenity) => ({
                value: amenity,
                label: amenity,
              }))}
            />
            <CustomFormField
              name="highlights"
              label="Highlights"
              type="multiselect"
              options={Object.keys(HighlightEnum).map((highlight) => ({
                value: highlight,
                label: highlight,
              }))}
            />
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <div>
          <h2 className="mb-4 text-lg font-semibold">Photos</h2>
          <Uploader
            key={uploaderKey}
            values={photoUrls}
            onChange={handlePhotoUrlsChange}
          />
          {form.formState.errors.photoUrls && (
            <p className="text-destructive mt-1 text-sm">
              {form.formState.errors.photoUrls.message}
            </p>
          )}
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="space-y-6">
          <h2 className="mb-4 text-lg font-semibold">Additional Information</h2>
          <CustomFormField name="address" label="Address" />
          <div className="flex justify-between gap-4">
            <CustomFormField name="city" label="City" className="w-full" />
            <CustomFormField name="state" label="State" className="w-full" />
            <CustomFormField
              name="postalCode"
              label="Postal Code"
              className="w-full"
            />
          </div>
          <CustomFormField name="country" label="Country" />
        </div>

        <Button
          type="submit"
          className="bg-primary-700 mt-8 w-full text-white"
          disabled={isPending || !form.formState.isDirty}
        >
          {isPending ? (
            <>
              <Spinner />
              Creating Property...
            </>
          ) : (
            "Create Property"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default NewPropertyForm;
