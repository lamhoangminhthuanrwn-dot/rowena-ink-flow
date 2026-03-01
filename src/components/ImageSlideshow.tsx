import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ImageSlideshowProps {
  images: string[];
  alt: string;
  className?: string;
  interval?: number;
  showDots?: boolean;
}

const ImageSlideshow = ({ images, alt, className, interval = 5000, showDots = true }: ImageSlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval]);

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${alt} ${i + 1}`}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            i === currentIndex ? "opacity-100" : "opacity-0"
          )}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
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
