import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageCarousel = ({ images, currentImageIndex, setCurrentImageIndex }) => {
  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative mb-4">
      <div className="relative aspect-video rounded-sm overflow-hidden">
        <img
          src={images[currentImageIndex] || "/placeholder.svg"}
          alt="Property image"
          className="object-cover w-full h-full"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
          onClick={prevImage}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
          onClick={nextImage}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      <div className="grid grid-cols-6 gap-2 mt-2">
        {images.map((thumb, index) => (
          <div
            key={index}
            className="aspect-video rounded-sm overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setCurrentImageIndex(index)}
          >
            <img
              src={thumb || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
