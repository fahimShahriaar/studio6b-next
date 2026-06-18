"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type Slide = {
  id: string;
  imageUrl: string;
  headline: string | null;
  subtext: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
};

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => go(index + 1), 6000);
    return () => clearInterval(t);
  }, [index, count, go]);

  if (count === 0) return null;

  return (
    <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-neutral-900">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.headline ?? "Gallery"}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-6xl px-4 pb-16 text-white">
              {slide.headline ? (
                <h1 className="max-w-2xl font-serif text-4xl font-semibold drop-shadow sm:text-5xl">
                  {slide.headline}
                </h1>
              ) : null}
              {slide.subtext ? (
                <p className="mt-3 max-w-xl text-base text-white/90 sm:text-lg">
                  {slide.subtext}
                </p>
              ) : null}
              {slide.ctaLabel && slide.ctaHref ? (
                <Link
                  href={slide.ctaHref}
                  className={cn(buttonVariants({ size: "lg" }), "mt-6")}
                >
                  {slide.ctaLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ))}

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/40"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/40"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-6 bg-white" : "w-2 bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
