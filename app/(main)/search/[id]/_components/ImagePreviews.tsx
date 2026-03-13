"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ImagePreviews = ({ images }: ImagePreviewsProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative h-[75vh] w-full">
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image}
            alt={`Property Image ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover transition-transform duration-500 ease-in-out"
          />
        </div>
      ))}
      <Button
        variant="default"
        size="icon-lg"
        onClick={handlePrev}
        className="absolute top-1/2 left-0 -translate-y-1/2 transform rounded-full focus:outline-none"
        aria-label="Previous image"
      >
        <ChevronLeft className="size-5 text-white" />
      </Button>
      <Button
        variant="default"
        size="icon-lg"
        onClick={handleNext}
        className="absolute top-1/2 right-0 -translate-y-1/2 transform rounded-full focus:outline-none"
        aria-label="Previous image"
      >
        <ChevronRight className="size-5 text-white" />
      </Button>
    </div>
  );
};

export default ImagePreviews;
