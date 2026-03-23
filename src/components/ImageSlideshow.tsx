import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSlideshowProps {
  images: string[];
  alt: string;
  className?: string;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  objectFit?: "cover" | "contain";
  grayscale?: boolean;
}

const ImageSlideshow = ({ images, alt, className, interval = 5000, showDots = true, showArrows = true, objectFit = "cover", grayscale = false }: ImageSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval]);

  return (
    <div className={cn("group/slide relative h-full w-full overflow-hidden", className)}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${alt} ${i + 1}`}
          className={cn(
            "absolute inset-0 h-full w-full transition-all duration-700",
            objectFit === "contain" ? "object-contain" : "object-cover",
            i === currentIndex ? "opacity-100" : "opacity-0",
            grayscale && "grayscale contrast-125 group-hover/slide:grayscale-0"
          )}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1 text-foreground opacity-0 transition-opacity group-hover/slide:opacity-100"
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1 text-foreground opacity-0 transition-opacity group-hover/slide:opacity-100"
            aria-label="Ảnh tiếp"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(i); }}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                i === currentIndex ? "bg-primary scale-110" : "bg-foreground/30"
              )}
              aria-label={`Ảnh ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlideshow;
