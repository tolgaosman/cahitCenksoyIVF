"use client";

import { useEffect, useState } from "react";
import styles from "./DecoSpheres.module.css";

type Sphere = {
  id: string;
  variant: string;
  top: number;
  left: number;
  opacity: number;
  animationName: string;
  animationDuration: string;
  animationDelay: string;
};

const PINK = ["pink-sm", "pink-md", "pink-lg"];
const LAV = ["lav-sm", "lav-md", "lav-lg"];
const PEACH = ["peach-sm", "peach-md"];
const ANIMS = ["float", "floatSlow", "floatFast"];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Ambient decorative spheres scattered down the full page height.
 * Built client-side only (positions are randomised) so it never runs
 * during SSR and can never cause a hydration mismatch.
 */
export default function DecoSpheres() {
  const [spheres, setSpheres] = useState<Sphere[]>([]);
  const [layerHeight, setLayerHeight] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    function build() {
      const docH = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const vw = window.innerWidth;
      const bandH = 360;
      const bands = Math.max(4, Math.ceil(docH / bandH));
      const next: Sphere[] = [];

      for (let b = 0; b < bands; b++) {
        const count = Math.random() < 0.5 ? 1 : 2;
        for (let i = 0; i < count; i++) {
          const usePeach = Math.random() < 0.12;
          const usePink = Math.random() < 0.5;
          const variant = usePeach ? pick(PEACH) : pick(usePink ? PINK : LAV);

          next.push({
            id: `${b}-${i}-${Math.random().toString(36).slice(2, 8)}`,
            variant,
            top: b * bandH + rand(0, bandH),
            left: rand(-4, 96),
            opacity: rand(0.28, 0.6),
            animationName: pick(ANIMS),
            animationDuration: `${rand(7, 12).toFixed(1)}s`,
            animationDelay: `-${rand(0, 8).toFixed(1)}s`,
          });
        }
      }

      // Thin out on narrow phones so it doesn't crowd the content.
      const thinned =
        vw <= 768 ? next.filter((_, idx) => idx % 2 !== 0) : next;

      setLayerHeight(docH);
      setSpheres(thinned);
    }

    build();

    // Re-measure once images/fonts settle and after late layout shifts.
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 250);
    };
    const settleTimer = setTimeout(build, 1500);

    window.addEventListener("load", build);
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("load", build);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      clearTimeout(settleTimer);
    };
  }, []);

  if (spheres.length === 0) return null;

  return (
    <div
      className={styles.layer}
      style={{ height: layerHeight }}
      aria-hidden="true"
    >
      {spheres.map((s) => (
        <div
          key={s.id}
          className={`${styles.sphere} ${styles[s.variant]}`}
          style={{
            top: s.top,
            left: `${s.left}%`,
            opacity: s.opacity,
            animationName: s.animationName,
            animationDuration: s.animationDuration,
            animationDelay: s.animationDelay,
          }}
        />
      ))}
    </div>
  );
}
