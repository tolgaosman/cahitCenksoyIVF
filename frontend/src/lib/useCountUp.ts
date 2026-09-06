"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 up to `target` once the returned ref scrolls
 * into view. Respects prefers-reduced-motion by jumping straight to the
 * final value once mounted.
 *
 * The state always starts at 0 on both server and client — reading
 * matchMedia() during the initial render would make the very first
 * client render disagree with the server-rendered HTML for anyone with
 * the OS preference set, causing a hydration mismatch. The jump to the
 * final value happens inside the effect instead, exactly like the
 * IntersectionObserver-driven update below it.
 */
export function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const jumpToFinalValue = () => setValue(target);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      jumpToFinalValue();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}
