"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./moduleNavigation.module.css";

// # Desktop module navigation
// The scroll container keeps native touch, trackpad and keyboard navigation.
// Observe both viewport and content widths so arrow availability stays accurate
// after responsive layout changes and font loading, without window listeners.
export default function ModuleNavigation({ modules, activeSlug, onSelect }) {
  const viewportRef = useRef(null);
  const rowRef = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const updateEdges = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const left = viewport.scrollLeft > 1;
    const right =
      viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft > 1;
    setEdges((previous) =>
      previous.left === left && previous.right === right
        ? previous
        : { left, right },
    );
  };

  useEffect(() => {
    const observer = new ResizeObserver(updateEdges);
    observer.observe(viewportRef.current);
    observer.observe(rowRef.current);
    updateEdges();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const selected = rowRef.current?.querySelector('[aria-current="page"]');
    if (!viewport || !selected) return;

    // # Reveal only the horizontal selection; scrollIntoView could also move
    // the page vertically while the visitor is reading a module further down.
    const start = selected.offsetLeft;
    const end = start + selected.offsetWidth;
    if (start < viewport.scrollLeft) viewport.scrollLeft = start;
    else if (end > viewport.scrollLeft + viewport.clientWidth) {
      viewport.scrollLeft = end - viewport.clientWidth;
    }
    updateEdges();
  }, [activeSlug]);

  const scrollModules = (direction) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollBy({
      left: direction * Math.max(160, viewport.clientWidth * 0.7),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  return (
    <nav
      aria-label="Audit modules"
      className={`hidden md:flex ${styles.navigation}`}
    >
      <button
        type="button"
        className={styles.arrow}
        aria-label="Scroll modules left"
        aria-controls="audit-module-scroll"
        disabled={!edges.left}
        onClick={() => scrollModules(-1)}
      >
        <ChevronLeft size={17} aria-hidden="true" />
      </button>
      <div
        id="audit-module-scroll"
        ref={viewportRef}
        onScroll={updateEdges}
        className={styles.viewport}
      >
        <div ref={rowRef} className={styles.row}>
          {modules.map((mod) => {
            const isActive = activeSlug === mod.slug;
            const Icon = mod.icon;
            return (
              <button
                type="button"
                key={mod.slug}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSelect(mod.slug)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${isActive ? "text-white shadow-md" : "text-brandInk/70 hover:text-brandDeep bg-slate-100 hover:bg-slate-200/80 border border-brandDeep/5"}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFeatureTab"
                    className="absolute inset-0 bg-gradient-to-r from-brandDeep to-brandIndigo rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  size={14}
                  aria-hidden="true"
                  className={`relative z-10 ${isActive ? "text-brandCyan" : "text-brandInk/60"}`}
                />
                <span className="relative z-10">{mod.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        className={styles.arrow}
        aria-label="Scroll modules right"
        aria-controls="audit-module-scroll"
        disabled={!edges.right}
        onClick={() => scrollModules(1)}
      >
        <ChevronRight size={17} aria-hidden="true" />
      </button>
    </nav>
  );
}
