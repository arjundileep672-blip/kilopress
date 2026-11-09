"use client";

import React, { useEffect, useRef, useState } from "react";
import { CompressionResult } from "@/types/image";
import { formatBytes } from "@/lib/image/validator";

interface BeforeAfterSliderProps {
  originalUrl: string;
  originalName: string;
  result: CompressionResult;
}

export function BeforeAfterSlider({
  originalUrl,
  originalName,
  result,
}: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  const updatePositionFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / Math.max(1, rect.width)) * 100;
    setSliderPos(Math.round(percent * 10) / 10);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      updatePositionFromClientX(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length === 0) return;
      updatePositionFromClientX(e.touches[0].clientX);
    };

    const handleStop = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseup", handleStop);
    window.addEventListener("touchend", handleStop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleStop);
      window.removeEventListener("touchend", handleStop);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSliderPos((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSliderPos((p) => Math.min(100, p + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => {
        isDraggingRef.current = true;
        updatePositionFromClientX(e.clientX);
      }}
      onTouchStart={(e) => {
        if (e.touches.length === 0) return;
        isDraggingRef.current = true;
        updatePositionFromClientX(e.touches[0].clientX);
      }}
      className="relative w-full h-[280px] sm:h-[360px] overflow-hidden border border-rule rounded bg-checkerboard cursor-ew-resize select-none"
    >
      {/* Compressed Layer */}
      <div className="w-full h-full flex items-center justify-center p-3">
        <img
          src={result.objectUrl}
          alt={`Compressed ${result.outputFileName}`}
          className="max-w-full max-h-full object-contain pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Original Layer clipped to sliderPos% */}
      <div
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        className="absolute inset-0 w-full h-full flex items-center justify-center p-3 pointer-events-none"
      >
        <img
          src={originalUrl}
          alt={`Original ${originalName}`}
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Slider Divider */}
      <div
        role="slider"
        tabIndex={0}
        aria-label="Before and after comparison slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPos)}
        onKeyDown={handleKeyDown}
        style={{ left: `${sliderPos}%` }}
        className="absolute top-0 bottom-0 w-px bg-ink z-10 flex items-center justify-center -translate-x-1/2"
      >
        <div className="px-1.5 py-0.5 rounded bg-ink text-surface font-mono text-[10px] shadow-sm">
          ↔
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none bg-surface/90 border border-rule text-ink px-2 py-0.5 rounded text-[11px] font-mono">
        Before: {formatBytes(result.originalSize)}
      </div>
      <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none bg-surface/90 border border-rule text-ink px-2 py-0.5 rounded text-[11px] font-mono">
        After: {formatBytes(result.compressedSize)}
      </div>
    </div>
  );
}
