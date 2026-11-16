"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useDialog } from "@/hooks/useDialog";
import type { ProductImage } from "@/types";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const dialogRef = useDialog<HTMLDivElement>(zoom !== null, () => setZoom(null));

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };
  const go = (i: number) => track.current?.scrollTo({ left: i * track.current.clientWidth, behavior: "smooth" });
  const step = (d: number) => setZoom((z) => (z === null ? z : (z + d + images.length) % images.length));

  return (
    <div>
      {/* Mobile & tablet: swipeable, snap-aligned */}
      <div className="relative -mx-5 md:-mx-10 lg:hidden">
        <div
          ref={track}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          aria-roledescription="carousel"
          aria-label={`${name} images`}
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setZoom(i)}
              className="relative aspect-[4/5] w-full shrink-0 snap-center bg-sand-light"
              aria-label={`View image ${i + 1} of ${images.length} full screen`}
            >
              <Image src={img.src} alt={img.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
            </button>
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1">
            {images.map((_, i) => (
              <button key={i} type="button" onClick={() => go(i)} className="grid h-8 w-7 place-items-center" aria-label={`Go to image ${i + 1}`} aria-current={active === i}>
                <span className={`block h-px w-5 transition-colors ${active === i ? "bg-charcoal" : "bg-charcoal/30"}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: editorial stack */}
      <div className="hidden gap-3 lg:grid lg:grid-cols-2">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setZoom(i)}
            className={`group relative cursor-zoom-in overflow-hidden bg-sand-light ${i === 0 ? "col-span-2 aspect-[4/5]" : "aspect-[4/5]"}`}
            aria-label={`Enlarge image ${i + 1} of ${images.length}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes={i === 0 ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 28vw, 50vw"}
              className="object-cover transition-transform duration-[1.4s] ease-(--ease-veyra) group-hover:scale-[1.02]"
            />
            <ZoomIn size={18} strokeWidth={1.1} className="absolute right-4 bottom-4 opacity-0 transition-opacity group-hover:opacity-70" aria-hidden />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {zoom !== null && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${name} — image ${zoom + 1} of ${images.length}`}
            className="fixed inset-0 z-[60] bg-ivory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="absolute inset-0">
              <Image src={images[zoom].src} alt={images[zoom].alt} fill sizes="100vw" quality={90} className="object-contain" />
            </div>
            <button type="button" onClick={() => setZoom(null)} className="absolute top-4 right-4 grid size-12 place-items-center bg-ivory/80" aria-label="Close" data-autofocus>
              <X size={22} strokeWidth={1.1} />
            </button>
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} className="absolute top-1/2 left-3 grid size-12 -translate-y-1/2 place-items-center bg-ivory/80" aria-label="Previous image">
                  <ChevronLeft size={22} strokeWidth={1.1} />
                </button>
                <button type="button" onClick={() => step(1)} className="absolute top-1/2 right-3 grid size-12 -translate-y-1/2 place-items-center bg-ivory/80" aria-label="Next image">
                  <ChevronRight size={22} strokeWidth={1.1} />
                </button>
              </>
            )}
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-[0.2em] text-stone tabular-nums">
              {zoom + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
