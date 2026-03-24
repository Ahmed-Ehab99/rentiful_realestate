"use client";

import { IMAGE_MAX_SIZE } from "@/lib/constants";
import { useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export interface FileUploadState {
  id: string;
  file: File | null;
  uploading: boolean;
  progress: number;
  key: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl: string;
}

interface UseMultiFileUploaderProps {
  /** Array of existing S3 keys */
  values?: string[];
  onChange?: (keys: string[]) => void;
  /** Construct a public URL from an S3 key */
  constructUrl: (key: string) => string;
}

export function useMultiFileUploader({
  values = [],
  onChange,
  constructUrl,
}: UseMultiFileUploaderProps) {
  // Initialise states from pre-existing keys (e.g. edit form)
  const [fileStates, setFileStates] = useState<FileUploadState[]>(() =>
    values.filter(Boolean).map((key) => ({
      id: uuidv4(),
      file: null,
      uploading: false,
      progress: 100,
      key,
      isDeleting: false,
      error: false,
      objectUrl: constructUrl(key),
    })),
  );

  // Cleanup object-URLs on unmount
  useEffect(() => {
    return () => {
      fileStates.forEach((s) => {
        if (s.objectUrl && !s.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(s.objectUrl);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateState = (id: string, patch: Partial<FileUploadState>) =>
    setFileStates((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );

  const uploadFile = async (id: string, file: File) => {
    updateState(id, { uploading: true, progress: 0 });

    try {
      const presignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      if (!presignedResponse.ok) {
        toast.error(`Failed to get upload URL for ${file.name}`);
        updateState(id, { uploading: false, progress: 0, error: true });
        return;
      }

      const { presignedUrl, key } = await presignedResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            updateState(id, {
              progress: Math.round((event.loaded / event.total) * 100),
            });
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            // Notify parent with the new complete set of keys
            setFileStates((prev) => {
              const next = prev.map((s) =>
                s.id === id
                  ? { ...s, uploading: false, progress: 100, key }
                  : s,
              );
              const keys = next
                .filter((s) => !s.uploading && !s.error && s.key)
                .map((s) => s.key);
              onChange?.(keys);
              return next;
            });
            // toast.success(`${file.name} uploaded`);
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch {
      toast.error(`Something went wrong uploading ${file.name}`);
      updateState(id, { uploading: false, progress: 0, error: true });
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const newStates: FileUploadState[] = acceptedFiles.map((file) => ({
      id: uuidv4(),
      file,
      uploading: false,
      progress: 0,
      key: "",
      isDeleting: false,
      error: false,
      objectUrl: URL.createObjectURL(file),
    }));

    setFileStates((prev) => [...prev, ...newStates]);

    // Kick off uploads after state is set
    newStates.forEach((state) => uploadFile(state.id, state.file!));
  };

  const onDropRejected = (fileRejections: FileRejection[]) => {
    const oversized = fileRejections.filter((r) =>
      r.errors.some((e) => e.code === "file-too-large"),
    );
    const wrongType = fileRejections.filter((r) =>
      r.errors.some((e) => e.code === "file-invalid-type"),
    );

    if (oversized.length) {
      toast.error(
        `${oversized.length} file(s) exceed the size limit (max ${IMAGE_MAX_SIZE / 1024 / 1024} MB)`,
      );
    }
    if (wrongType.length) {
      toast.error("Only image files are accepted");
    }
  };

  const handleRemoveFile = async (id: string) => {
    const state = fileStates.find((s) => s.id === id);
    if (!state || state.isDeleting) return;

    // If it never finished uploading just remove it locally
    if (!state.key) {
      if (state.objectUrl && !state.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(state.objectUrl);
      }
      setFileStates((prev) => {
        const next = prev.filter((s) => s.id !== id);
        const keys = next
          .filter((s) => !s.uploading && !s.error && s.key)
          .map((s) => s.key);
        onChange?.(keys);
        return next;
      });
      return;
    }

    updateState(id, { isDeleting: true });

    try {
      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: state.key }),
      });

      if (!response.ok) {
        toast.error("Failed to remove file from storage");
        updateState(id, { isDeleting: false, error: true });
        return;
      }

      if (state.objectUrl && !state.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(state.objectUrl);
      }

      setFileStates((prev) => {
        const next = prev.filter((s) => s.id !== id);
        const keys = next
          .filter((s) => !s.uploading && !s.error && s.key)
          .map((s) => s.key);
        onChange?.(keys);
        return next;
      });
      toast.success("Image removed");
    } catch {
      toast.error("Error removing file, please try again");
      updateState(id, { isDeleting: false, error: true });
    }
  };

  const retryUpload = (id: string) => {
    const state = fileStates.find((s) => s.id === id);
    if (!state?.file) return;
    updateState(id, { error: false });
    uploadFile(id, state.file);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { "image/*": [] },
    multiple: true,
    maxSize: IMAGE_MAX_SIZE,
  });

  return {
    fileStates,
    getRootProps,
    getInputProps,
    isDragActive,
    handleRemoveFile,
    retryUpload,
    open,
  };
}
