import React, { useState, useRef, useEffect } from "react";

interface RangeWheelProps {
  min: number;
  max: number;
  align?: "center" | "start" | "end";
  onChange?: (value: number) => void;
  initialValue?: number;
  orientation?: "vertical" | "horizontal";
}

export default function RangeWheel({
  min,
  max,
  align = "center",
  onChange,
  initialValue,
  orientation = "vertical",
}: RangeWheelProps) {
  const rangeArray = React.useMemo(() => {
    const step = min <= max ? 1 : -1;
    const arr = [];
    for (let i = min; step > 0 ? i <= max : i >= max; i += step) {
      arr.push(i);
    }
    return arr;
  }, [min, max]);

  const itemSize = orientation === "vertical" ? 60 : 120;
  const visibleItems = 5;
  const containerSize = itemSize * visibleItems;

  const initialIndex =
    initialValue !== undefined
      ? rangeArray.indexOf(initialValue)
      : Math.floor(rangeArray.length / 2);

  const [scroll, setScroll] = useState(initialIndex * itemSize);
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef(0);
  const velocityRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastScrollRef = useRef(scroll);
  const lastTimeRef = useRef(Date.now());
  const rafRef = useRef<number | undefined>(undefined);

  const isVertical = orientation === "vertical";

  const getCurrentValue = (scrollValue: number) => {
    const index = Math.round(scrollValue / itemSize);
    const clampedIndex = Math.max(0, Math.min(rangeArray.length - 1, index));
    return rangeArray[clampedIndex];
  };

  const snapToNearest = (currentScroll: number, currentVelocity: number) => {
    let finalScroll = currentScroll + currentVelocity * 0.2;
    const targetIndex = Math.round(finalScroll / itemSize);
    const clampedIndex = Math.max(
      0,
      Math.min(rangeArray.length - 1, targetIndex)
    );
    finalScroll = clampedIndex * itemSize;

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

      setScroll(newScroll);

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
    startPosRef.current = isVertical ? e.clientY : e.clientX;
    velocityRef.current = 0;
    lastScrollRef.current = scroll;
    lastTimeRef.current = Date.now();
    if (animationRef.current !== undefined) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startPosRef.current = isVertical
      ? e.touches[0].clientY
      : e.touches[0].clientX;
    velocityRef.current = 0;
    lastScrollRef.current = scroll;
    lastTimeRef.current = Date.now();
    if (animationRef.current !== undefined) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleMove = (clientPos: number) => {
    if (!isDragging) return;

    const delta = startPosRef.current - clientPos;
    let newScroll = lastScrollRef.current + delta;
    const maxScroll = (rangeArray.length - 1) * itemSize;

    // Rubber band effect at edges
    if (newScroll < 0) {
      newScroll = newScroll * 0.4;
    } else if (newScroll > maxScroll) {
      newScroll = maxScroll + (newScroll - maxScroll) * 0.4;
    }

    const now = Date.now();
    const timeDelta = now - lastTimeRef.current;
    if (timeDelta > 0) {
      velocityRef.current = ((newScroll - scroll) / timeDelta) * 16;
    }
    lastTimeRef.current = now;

    // Use RAF for smooth updates during drag
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      setScroll(newScroll);
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(isVertical ? e.clientY : e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(isVertical ? e.touches[0].clientY : e.touches[0].clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Clamp back to valid range before snapping
    const maxScroll = (rangeArray.length - 1) * itemSize;
    const clampedScroll = Math.max(0, Math.min(maxScroll, scroll));

    if (scroll !== clampedScroll) {
      setScroll(clampedScroll);
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
  }, [isDragging, scroll, isVertical]);

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
    const itemPosition = index * itemSize;
    const distance = Math.abs(itemPosition - scroll);
    const maxDistance = itemSize * 2.2;
    return Math.max(0.15, 1 - distance / maxDistance);
  };

  const getScale = (index: number) => {
    const itemPosition = index * itemSize;
    const distance = Math.abs(itemPosition - scroll);
    const maxDistance = itemSize * 2;
    return Math.max(0.65, 1 - (distance / maxDistance) * 0.35);
  };

  const gradientStyle = isVertical
    ? {
        background: `linear-gradient(to bottom, 
          rgba(255,255,255,1) 0%, 
          rgba(255,255,255,0) 38%, 
          rgba(255,255,255,0) 62%, 
          rgba(255,255,255,1) 100%)`,
      }
    : {
        background: `linear-gradient(to right, 
          rgba(255,255,255,1) 0%, 
          rgba(255,255,255,0) 38%, 
          rgba(255,255,255,0) 62%, 
          rgba(255,255,255,1) 100%)`,
      };

  const containerStyle = isVertical
    ? { height: containerSize, width: "fit-content", minWidth: 90 }
    : { width: containerSize, height: "fit-content", minHeight: 90 };

  const highlightStyle = isVertical
    ? {
        top: "50%",
        left: 0,
        right: 0,
        height: itemSize,
        transform: "translateY(-50%)",
      }
    : {
        left: "50%",
        top: 0,
        bottom: 0,
        width: itemSize,
        transform: "translateX(-50%)",
      };

  const itemsTransform = isVertical
    ? `translateY(${containerSize / 2 - itemSize / 2 - scroll}px)`
    : `translateX(${containerSize / 2 - itemSize / 2 - scroll}px)`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        className="relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
        style={containerStyle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={gradientStyle}
        />

        <div
          className="absolute pointer-events-none z-10"
          style={highlightStyle}
        />

        <div
          className={`relative will-change-transform ${
            isVertical ? "" : "flex"
          }`}
          style={{
            transform: itemsTransform,
            transition: isDragging
              ? "none"
              : "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {rangeArray.map((num, index) => {
            const opacity = getOpacity(index);
            const scale = getScale(index);

            const itemStyle = isVertical
              ? {
                  height: itemSize,
                  opacity,
                  transform: `scale(${scale})`,
                  fontSize: "4rem",
                  fontWeight: 500,
                  lineHeight: `${itemSize}px`,
                  transition:
                    "opacity 0.15s ease-out, transform 0.15s ease-out",
                }
              : {
                  minWidth: itemSize,
                  width: itemSize,
                  opacity,
                  transform: `scale(${scale})`,
                  fontSize: "4rem",
                  fontWeight: 500,
                  lineHeight: `${itemSize}px`,
                  transition:
                    "opacity 0.15s ease-out, transform 0.15s ease-out",
                  flexShrink: 0,
                };

            return (
              <div
                key={num}
                className={`flex font-mono will-change-transform  ${
                  isVertical
                    ? align === "center"
                      ? "justify-center"
                      : align === "end"
                      ? "justify-end"
                      : "justify-start"
                    : "items-center justify-center"
                }`}
                style={itemStyle}
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
