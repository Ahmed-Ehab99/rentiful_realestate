"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMultiFileUploader } from "@/hooks/use-multi-file-uploader";
import { cn, constructUrl } from "@/lib/utils";
import {
  RenderEmptyState,
  RenderErrorTile,
  RenderUploadedTile,
  RenderUploadingTile,
} from "./RenderState";

interface UploaderProps {
  values?: string[];
  onChange?: (keys: string[]) => void;
  resetKey?: number;
}

const Uploader = ({ values = [], onChange, resetKey }: UploaderProps) => {
  const {
    fileStates,
    getRootProps,
    getInputProps,
    isDragActive,
    handleRemoveFile,
    retryUpload,
  } = useMultiFileUploader({
    values,
    onChange,
    constructUrl,
  });

  const hasFiles = fileStates.length > 0;

  return (
    <div key={resetKey}>
      <Card
        {...getRootProps()}
        className={cn(
          "relative w-full cursor-pointer border-2 border-dashed transition-colors duration-200",
          isDragActive
            ? "border-primary bg-primary/5 border-solid"
            : "border-border hover:border-primary",
        )}
      >
        <CardContent className="flex size-full flex-col gap-4 p-4">
          <Label htmlFor="multi-image-input" className="sr-only">
            Image Uploader
          </Label>
          <Input
            {...getInputProps()}
            id="multi-image-input"
            aria-label="Image Uploader"
          />

          {/* Always show the drop prompt */}
          <div
            className={cn(
              "flex items-center justify-center",
              hasFiles ? "py-2" : "py-8",
            )}
          >
            <RenderEmptyState isDragActive={isDragActive} />
          </div>

          {/* Image grid inside the card */}
          {hasFiles && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {fileStates.map((state) => {
                if (state.uploading) {
                  return (
                    <RenderUploadingTile
                      key={state.id}
                      progress={state.progress}
                      objectUrl={state.objectUrl}
                      fileName={state.file?.name ?? ""}
                    />
                  );
                }

                if (state.error) {
                  return (
                    <RenderErrorTile
                      key={state.id}
                      objectUrl={state.objectUrl}
                      fileName={state.file?.name ?? ""}
                      onRetry={() => retryUpload(state.id)}
                      onRemove={() => handleRemoveFile(state.id)}
                    />
                  );
                }

                return (
                  <RenderUploadedTile
                    key={state.id}
                    objectUrl={state.objectUrl}
                    isDeleting={state.isDeleting}
                    onRemove={() => handleRemoveFile(state.id)}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Uploader;
