import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from "@/lib/constants";
import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  pricePerMonth: z.number().positive().min(0).int(),
  securityDeposit: z.number().positive().min(0).int(),
  applicationFee: z.number().positive().min(0).int(),
  isPetsAllowed: z.boolean(),
  isParkingIncluded: z.boolean(),
  photoUrls: z.array(z.string().url()).min(1, "At least one photo is required"),
  amenities: z
    .array(z.nativeEnum(AmenityEnum))
    .min(1, "Select at least one amenity"),
  highlights: z
    .array(z.nativeEnum(HighlightEnum))
    .min(1, "Select at least one highlight"),
  beds: z.number().positive().min(0).max(10).int(),
  baths: z.number().positive().min(0).max(10).int(),
  squareFeet: z.number().int().positive(),
  propertyType: z.nativeEnum(PropertyTypeEnum),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

export const propertyFormSchema = propertySchema.extend({
  // The form stores the resulting S3 object keys (not File objects).
  photoUrls: z
    .array(z.string())
    .refine(
      (arr) => arr.some((v) => typeof v === "string" && v.trim().length > 0),
      {
        message: "At least one photo is required",
      },
    ),
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;

export const applicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(11, "Phone number must be at least 11 digits"),
  message: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(11, "Phone number must be at least 11 digits"),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
