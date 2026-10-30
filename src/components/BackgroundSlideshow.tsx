import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react";

// Rwanda farming & farmers — background slideshow imagery.
const BASE =
  "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/08d11f00-1530-4ef4-946f-8d73d3a6b3a1";

export const SLIDESHOW_IMAGES: string[] = [
  `${BASE}/rwanda-terraced-hills-d58edd94-1793116469578.webp`,
  `${BASE}/rwanda-maize-harvest-ab318f77-1793116457359.webp`,
  `${BASE}/rwanda-coffee-harvest-a434d080-1793116457946.webp`,
  `${BASE}/rwanda-tea-pickers-318b9d07-1793116457262.webp`,
  `${BASE}/rwanda-market-women-f6242c8f-1793116457227.webp`,
];

const CAPTIONS: { en: string; rw: string }[] = [
  { en: "Terraced hills of Rwanda", rw: "Imisozi y'ubuhinzi mu Rwanda" },
  { en: "Maize harvest", rw: "Isarura ry'ibigori" },
  { en: "Coffee cherries", rw: "Ikawa" },
  { en: "Tea plantations", rw: "Icyayi" },
  { en: "Farmers' market", rw: "Isoko ry'abahinzi" },
];

/**
 * Bounded hero slideshow. Fixed, limited height so page content and text stay
 * fully readable below/around it, with visible captions, controls and dots.
 */
export default function BackgroundSlideshow({ lang = "en" }: { lang?: "en" | "rw" }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const go = useCallback((next: number) => {
    setIndex((next + SLIDESHOW_IMAGES.length) % SLIDESHOW_IMAGES.length);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setIndex((n) => (n + 1) % SLIDESHOW_IMAGES.length), 5500);
    return () => clearInterval(timer);
  }, [playing]);

  return (
    <div className="group relative h-56 w-full overflow-hidden rounded-2xl border border-emerald-900/10 shadow-lg sm:h-64 md:h-72">
      <AnimatePresence mode="sync">
        <motion.img
          key={index}
          src={SLIDESHOW_IMAGES[index]}
          alt=""
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.9, ease: "easeInOut" },
            scale: { duration: 6.5, ease: "linear" },
          }}
          className="absolute inset-0 size-full object-cover"
        />
      </AnimatePresence>

      {/* Readability scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/25 to-transparent" />

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <p className="text-base font-semibold text-white drop-shadow">
              {lang === "rw" ? CAPTIONS[index]?.rw : CAPTIONS[index]?.en}
            </p>
            <p className="text-xs text-white/75">
              {lang === "rw" ? CAPTIONS[index]?.en : CAPTIONS[index]?.rw}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 opacity-0 transition group-hover:opacity-100">
        <button
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
          className="rounded-full bg-black/40 p-1.5 text-white backdrop-blur transition hover:bg-black/60"
        >
          <CaretLeft size={16} weight="bold" />
        </button>
        <button
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
          onClick={() => setPlaying((p) => !p)}
          className="rounded-full bg-black/40 p-1.5 text-white backdrop-blur transition hover:bg-black/60"
        >
          {playing ? <Pause size={15} weight="fill" /> : <Play size={15} weight="fill" />}
        </button>
        <button
          aria-label="Next slide"
          onClick={() => go(index + 1)}
          className="rounded-full bg-black/40 p-1.5 text-white backdrop-blur transition hover:bg-black/60"
        >
          <CaretRight size={16} weight="bold" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 right-4 flex gap-1.5">
        {SLIDESHOW_IMAGES.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}