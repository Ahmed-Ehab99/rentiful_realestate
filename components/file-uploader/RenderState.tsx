import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CloudUpload, ImageIcon, Loader, RefreshCw, X } from "lucide-react";
import Image from "next/image";

// ---------------------------------------------------------------------------
// Empty / drag-active state shown inside the drop zone
// ---------------------------------------------------------------------------
export const RenderEmptyState = ({
  isDragActive,
}: {
  isDragActive: boolean;
}) => (
  <div className="flex flex-col items-center gap-3 text-center">
    <div
      className={cn(
        "flex size-12 items-center justify-center rounded-full transition-colors",
        isDragActive ? "bg-primary/20" : "bg-muted",
      )}
    >
      <CloudUpload
        size={24}
        className={cn(
          "transition-colors",
          isDragActive ? "text-primary" : "text-muted-foreground",
        )}
      />
    </div>
    <div>
      <p className="text-foreground text-base font-semibold">
        {isDragActive ? (
          "Drop images here"
        ) : (
          <>
            Drag & drop images or{" "}
            <span className="text-primary cursor-pointer font-bold">
              click to browse
            </span>
          </>
        )}
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        PNG, JPG, WEBP — multiple files supported
      </p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Single image tile — uploading state (shown inside the grid)
// ---------------------------------------------------------------------------
export const RenderUploadingTile = ({
  progress,
  objectUrl,
  fileName,
}: {
  progress: number;
  objectUrl: string;
  fileName: string;
}) => (
  <div className="bg-muted relative aspect-square overflow-hidden rounded-lg border">
    {/* dim preview */}
    <Image
      src={objectUrl}
      alt={fileName}
      fill
      className="object-cover opacity-40"
    />
    {/* overlay */}
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/30 p-3">
      <p className="text-xs font-semibold text-white drop-shadow">
        {progress}%
      </p>
      {/* progress bar */}
      <div className="h-1.5 w-full max-w-[80%] overflow-hidden rounded-full bg-white/30">
        <div
          className="h-full rounded-full bg-white transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="max-w-full truncate text-[10px] text-white/80">
        {fileName}
      </p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Single image tile — uploaded state
// ---------------------------------------------------------------------------
export const RenderUploadedTile = ({
  objectUrl,
  isDeleting,
  onRemove,
  alt,
}: {
  objectUrl: string;
  isDeleting: boolean;
  onRemove: () => void;
  alt?: string;
}) => (
  <div className="group bg-muted relative aspect-square overflow-hidden rounded-lg border">
    <Image
      src={objectUrl}
      alt={alt ?? "Uploaded image"}
      fill
      className="object-cover transition-transform duration-200 group-hover:scale-105"
    />
    <Button
      title="Delete Image"
      type="button"
      variant="destructive"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
      disabled={isDeleting}
      className="absolute top-1 right-1 size-6 shadow transition-opacity"
      aria-label="Remove image"
    >
      {isDeleting ? (
        <Loader size={12} className="animate-spin" />
      ) : (
        <X size={12} />
      )}
    </Button>
  </div>
);

// ---------------------------------------------------------------------------
// Single image tile — error state
// ---------------------------------------------------------------------------
export const RenderErrorTile = ({
  objectUrl,
  fileName,
  onRetry,
  onRemove,
}: {
  objectUrl: string;
  fileName: string;
  onRetry: () => void;
  onRemove: () => void;
}) => (
  <div className="group border-destructive bg-muted relative aspect-square overflow-hidden rounded-lg border">
    <Image
      src={objectUrl}
      alt={fileName}
      fill
      className="object-cover opacity-30"
    />
    <div className="bg-destructive/20 absolute inset-0 flex flex-col items-center justify-center gap-2 p-2">
      <ImageIcon size={20} className="text-destructive" />
      <p className="text-destructive text-center text-[10px] font-semibold">
        Upload failed
      </p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-6 gap-1 px-2 text-[10px]"
        onClick={(e) => {
          e.stopPropagation();
          onRetry();
        }}
      >
        <RefreshCw size={10} />
        Retry
      </Button>
    </div>
    {/* remove button */}
    <Button
      type="button"
      variant="destructive"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
      className="absolute top-1 right-1 size-6 opacity-0 shadow transition-opacity group-hover:opacity-100"
      aria-label="Remove image"
    >
      <X size={12} />
    </Button>
  </div>
);
