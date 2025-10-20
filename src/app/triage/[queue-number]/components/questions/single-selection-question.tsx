import { motion, PanInfo } from "motion/react";
import React, { ReactNode, useState, useRef } from "react";
import { Button } from "@/components/button";
import { QuizOption, useQuiz } from "@/contexts/quiz-context";

interface SingleSelectionQuestionProps {
  question: ReactNode;
  options: QuizOption[];
}

export default function SingleSelectionQuestion({
  question,
  options,
}: SingleSelectionQuestionProps) {
  const { next } = useQuiz();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSelect = (value: string) => () => {
    // Prevent selection when dragging
    if (isDragging) return;
    next(value);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (scrollContainerRef.current) {
      const currentScroll = scrollContainerRef.current.scrollTop;
      const newScroll = currentScroll - info.delta.y;
      scrollContainerRef.current.scrollTop = newScroll;
    }
  };

  const handleDragEnd = () => {
    // Small delay to prevent click event after drag
    setTimeout(() => setIsDragging(false), 100);
  };

  return (
    <>
      <h1 className="font-bold text-5xl h-24">{question}</h1>
      <div className="relative w-full h-full p-1 pb-20">
        <motion.div
          ref={scrollContainerRef}
          className="grid gap-4 w-full h-full py-12 overflow-y-scroll scrollbar-hide touch-pan-y"
          initial={{ opacity: 0, y: "10%" }}
          animate={{ opacity: 1, y: "0%" }}
          transition={{ delay: 0, duration: 1, ease: "easeInOut" }}
          style={{
            scrollBehavior: isDragging ? "auto" : "smooth",
          }}
        >
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className="grid gap-4 cursor-grab active:cursor-grabbing"
          >
            {options.map((option) => (
              <Button
                key={option.value}
                label={option.label}
                direction="middle"
                onClick={handleSelect(option.value)}
                buttonBgColor="bg-black"
                contentBgColor="bg-white"
                className="select-none"
              />
            ))}
          </motion.div>
        </motion.div>

        <div
          className="absolute inset-0 pointer-events-none w-screen"
          style={{
            background:
              "linear-gradient(to bottom, white 5%, transparent 15%, transparent 80%, white 100%)",
          }}
        />
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
