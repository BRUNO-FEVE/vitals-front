import React, { useState, useRef, useEffect } from "react";

interface RangeWheelProps {
  min: number;
  max: number;
  align?: "center" | "start" | "end";
  onChange?: (value: number) => void;
  initialValue?: number;
}

export default function RangeWheel({
  min,
  max,
  align = "center",
  onChange,
  initialValue,
}: RangeWheelProps) {
  const rangeArray = React.useMemo(() => {
    const step = min <= max ? 1 : -1;
    const arr = [];
    for (let i = min; step > 0 ? i <= max : i >= max; i += step) {
      arr.push(i);
    }
    return arr;
  }, [min, max]);

  const itemHeight = 60;
  const visibleItems = 5;
  const containerHeight = itemHeight * visibleItems;

  const initialIndex =
    initialValue !== undefined
      ? rangeArray.indexOf(initialValue)
      : Math.floor(rangeArray.length / 2);

  const [scrollY, setScrollY] = useState(initialIndex * itemHeight);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const velocityRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastScrollYRef = useRef(scrollY);
  const lastTimeRef = useRef(Date.now());
  const rafRef = useRef<number | undefined>(undefined);

  const getCurrentValue = (scroll: number) => {
    const index = Math.round(scroll / itemHeight);
    const clampedIndex = Math.max(0, Math.min(rangeArray.length - 1, index));
    return rangeArray[clampedIndex];
  };

  const snapToNearest = (currentScroll: number, currentVelocity: number) => {
    let finalScroll = currentScroll + currentVelocity * 0.2;
    const targetIndex = Math.round(finalScroll / itemHeight);
    const clampedIndex = Math.max(
      0,
      Math.min(rangeArray.length - 1, targetIndex)
    );
    finalScroll = clampedIndex * itemHeight;

    const startScroll = currentScroll;
    const distance = finalScroll - startScroll;
    const duration = 350;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth spring-like easing
      const easeOut = 1 - Math.pow(1 - progress, 3.5);
      const newScroll = startScroll + distance * easeOut;

      setScrollY(newScroll);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onChange?.(getCurrentValue(finalScroll));
      }
    };

    animate();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    velocityRef.current = 0;
    lastScrollYRef.current = scrollY;
    lastTimeRef.current = Date.now();
    if (animationRef.current !== undefined) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startYRef.current = e.touches[0].clientY;
    velocityRef.current = 0;
    lastScrollYRef.current = scrollY;
    lastTimeRef.current = Date.now();
    if (animationRef.current !== undefined) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;

    const deltaY = startYRef.current - clientY;
    let newScrollY = lastScrollYRef.current + deltaY;
    const maxScroll = (rangeArray.length - 1) * itemHeight;

    // Rubber band effect at edges
    if (newScrollY < 0) {
      newScrollY = newScrollY * 0.4;
    } else if (newScrollY > maxScroll) {
      newScrollY = maxScroll + (newScrollY - maxScroll) * 0.4;
    }

    const now = Date.now();
    const timeDelta = now - lastTimeRef.current;
    if (timeDelta > 0) {
      velocityRef.current = ((newScrollY - scrollY) / timeDelta) * 16;
    }
    lastTimeRef.current = now;

    // Use RAF for smooth updates during drag
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      setScrollY(newScrollY);
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientY);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Clamp back to valid range before snapping
    const maxScroll = (rangeArray.length - 1) * itemHeight;
    const clampedScroll = Math.max(0, Math.min(maxScroll, scrollY));

    if (scrollY !== clampedScroll) {
      setScrollY(clampedScroll);
    }

    snapToNearest(clampedScroll, velocityRef.current);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleEnd);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleEnd);
      };
    }
  }, [isDragging, scrollY]);

  useEffect(() => {
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const getOpacity = (index: number) => {
    const itemPosition = index * itemHeight;
    const distance = Math.abs(itemPosition - scrollY);
    const maxDistance = itemHeight * 2.2;
    return Math.max(0.15, 1 - distance / maxDistance);
  };

  const getScale = (index: number) => {
    const itemPosition = index * itemHeight;
    const distance = Math.abs(itemPosition - scrollY);
    const maxDistance = itemHeight * 2;
    return Math.max(0.65, 1 - (distance / maxDistance) * 0.35);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        className="relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
        style={{ height: containerHeight, width: "fit-content", minWidth: 90 }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `linear-gradient(to bottom, 
              rgba(255,255,255,1) 0%, 
              rgba(255,255,255,0) 38%, 
              rgba(255,255,255,0) 62%, 
              rgba(255,255,255,1) 100%)`,
          }}
        />

        <div
          className="absolute top-1/2 left-0 right-0 h-[60px] pointer-events-none z-10"
          style={{ transform: "translateY(-50%)" }}
        />

        <div
          className="relative will-change-transform"
          style={{
            transform: `translateY(${
              containerHeight / 2 - itemHeight / 2 - scrollY
            }px)`,
            // Remove transition during drag for immediate response
            transition: isDragging
              ? "none"
              : "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {rangeArray.map((num, index) => {
            const opacity = getOpacity(index);
            const scale = getScale(index);

            return (
              <div
                key={num}
                className={`flex font-mono will-change-transform ${
                  align === "center"
                    ? "justify-center"
                    : align === "end"
                    ? "justify-end"
                    : "justify-start"
                }`}
                style={{
                  height: itemHeight,
                  opacity,
                  transform: `scale(${scale})`,
                  fontSize: "4rem",
                  fontWeight: 500,
                  lineHeight: `${itemHeight}px`,
                  // Smooth transitions for opacity and scale during ALL movements
                  transition:
                    "opacity 0.15s ease-out, transform 0.15s ease-out",
                }}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
