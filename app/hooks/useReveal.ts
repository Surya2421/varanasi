"use client";

import { useEffect, useRef } from "react";

/**
 * Adds .visible to element when it enters the viewport.
 * Use with .reveal + .reveal-delay-N classes in CSS.
 */
export function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already visible? Skip.
    if (el.classList.contains("visible")) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return ref;
}

/**
 * Adds .visible to multiple children of a container.
 * Each child with .reveal will animate in sequence.
 */
export function useRevealChildren(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = Array.from(el.querySelectorAll<HTMLElement>(".reveal"));
    if (children.length === 0) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child) => child.classList.add("visible"));
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return ref;
}
