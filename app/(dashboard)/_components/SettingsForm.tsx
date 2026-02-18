"use client";

import { CustomFormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SettingsFormData, settingsSchema } from "@/lib/schemas";
import { tryCatch } from "@/lib/try-catch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateSettings } from "../actions";

const SettingsForm = ({ initialData, userType }: SettingsFormProps) => {
  const [editMode, setEditMode] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  });
  const { isDirty } = form.formState;

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      form.reset(initialData);
    }
  };

  const handleSubmit = (data: SettingsFormData) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateSettings(data));
      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }
      if (result.status === "success") {
        toast.success("Settings updated successfully");
        setEditMode(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="">
      <div className="mb-5">
        <h1 className="text-xl font-semibold">
          {`${userType.charAt(0).toUpperCase() + userType.slice(1)} Settings`}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account preferences and personal information
        </p>
      </div>
      <Card className="max-w-xl">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <CustomFormField name="name" label="Name" disabled={!editMode} />
              <CustomFormField
                name="email"
                label="Email"
                type="email"
                disabled={!editMode}
              />
              <CustomFormField
                name="phoneNumber"
                label="Phone Number"
                disabled={!editMode}
              />

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  onClick={toggleEditMode}
                  className="bg-secondary-500 hover:bg-secondary-600 text-white"
                >
                  {editMode ? "Cancel" : "Edit"}
                </Button>
                {editMode && (
                  <Button
                    type="submit"
                    disabled={isPending || !isDirty}
                    className="bg-primary-700 hover:bg-primary-800 text-white"
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsForm;
