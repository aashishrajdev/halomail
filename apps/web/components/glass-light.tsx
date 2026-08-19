"use client";

import { useEffect } from "react";

/**
 * Drives the cursor-follow lighting on `.glass` panels — currently the landing
 * hero preview and the two pricing plan cards.
 *
 * Writes three custom properties per panel and lets CSS render them:
 *   --mx / --my  pointer position in panel-local percentages
 *   --lit        0..1 proximity, so the light falls off instead of snapping on
 *
 * One pointermove listener for the page. Rects are cached and re-measured only
 * on scroll/resize, so the move handler never forces layout.
 */
export function GlassLight() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let panels: HTMLElement[] = [];
    let rects: DOMRect[] = [];
    let frame = 0;
    let pending: { x: number; y: number } | null = null;

    // Distance beyond a panel's edge at which its highlight fades to nothing.
    const FALLOFF = 260;

    const measure = () => {
      panels = Array.from(document.querySelectorAll<HTMLElement>(".glass"));
      rects = panels.map((el) => el.getBoundingClientRect());
    };

    const paint = () => {
      frame = 0;
      if (!pending) return;
      const { x, y } = pending;

      for (let i = 0; i < panels.length; i++) {
        const r = rects[i];
        if (!r || r.width === 0) continue;
        if (r.bottom < -FALLOFF || r.top > window.innerHeight + FALLOFF) continue;

        const dx = x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
        const dy = y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0;
        const lit = Math.max(0, 1 - Math.hypot(dx, dy) / FALLOFF);

        const el = panels[i];
        if (lit === 0) {
          if (el.style.getPropertyValue("--lit") !== "0") el.style.setProperty("--lit", "0");
          continue;
        }

        el.style.setProperty("--mx", `${((x - r.left) / r.width) * 100}%`);
        el.style.setProperty("--my", `${((y - r.top) / r.height) * 100}%`);
        el.style.setProperty("--lit", lit.toFixed(3));
      }
    };

    const onMove = (e: PointerEvent) => {
      pending = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLayout = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          measure();
          paint();
        });
      }
    };

    measure();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onLayout, { passive: true });
    window.addEventListener("resize", onLayout);

    // Panels can mount after this effect runs (route changes).
    const observer = new MutationObserver(measure);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onLayout);
      window.removeEventListener("resize", onLayout);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
