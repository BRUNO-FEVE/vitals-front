/* eslint-disable react-hooks/exhaustive-deps */
import Slider from "@/components/slider";
import { motion, AnimatePresence } from "motion/react";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/button";
import { MoveRight } from "lucide-react";
import { useQuiz } from "@/contexts/quiz-context";

export interface SlideQuestionProps {
  question: ReactNode;
  options: { label: string; value: string }[];
}

export default function SlideQuestion({
  question,
  options,
}: SlideQuestionProps) {
  const [value, setValue] = useState<string>();
  const [prevValue, setPrevValue] = useState<string>();
  const [optionsLabel, setOptionsLabels] = useState<string[]>([]);
  const { next } = useQuiz();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const handleSubmit = () => {
    if (value) {
      next(value);
    }
  };

  useEffect(() => {
    if (value && !hasAnimated) {
      setHasAnimated(true);
    }

    // Determine direction based on value change
    if (value && prevValue) {
      const currentIndex = optionsLabel.indexOf(value);
      const previousIndex = optionsLabel.indexOf(prevValue);

      if (currentIndex > previousIndex) {
        setDirection("right"); // Moving right on slider
      } else if (currentIndex < previousIndex) {
        setDirection("left"); // Moving left on slider
      }
    }

    // Update previous value
    if (value) {
      setPrevValue(value);
    }
  }, [value, hasAnimated]);

  const disabled = useMemo(() => {
    return value === undefined;
  }, [value]);

  useEffect(() => {
    options.map((option) => {
      setOptionsLabels((prev) => [...prev, option.value]);
    });
  }, []);

  // Get the current label based on value
  const currentLabel = value
    ? options.find((option) => option.value === value)?.label
    : null;

  return (
    <>
      <motion.div
        className="flex flex-col justify-between h-full w-4/4 mt-6"
        initial={{ opacity: 0, y: "10%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ delay: 0, duration: 1, ease: "easeInOut" }}
      >
        <h1 className="font-bold text-5xl">{question}</h1>
        <Slider setValue={setValue} range={optionsLabel} />
        <div className="flex flex-row justify-end items-center">
          {value && (
            <motion.div
              className="h-[80px] flex items-center justify-center w-1/2 bg-black overflow-hidden relative"
              initial={!hasAnimated ? { x: "100%" } : false}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <AnimatePresence mode="wait">
                {currentLabel && (
                  <motion.h1
                    key={currentLabel}
                    className="absolute font-light font-mono text-xl text-white px-4 py-4 text-center w-full"
                    initial={
                      !hasAnimated
                        ? { opacity: 0 }
                        : direction === "right"
                        ? { x: 100, opacity: 0 }
                        : { x: -100, opacity: 0 }
                    }
                    animate={{ x: 0, opacity: 1 }}
                    exit={
                      direction === "right"
                        ? { x: -100, opacity: 0 }
                        : { x: 100, opacity: 0 }
                    }
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    {currentLabel}
                  </motion.h1>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          <div className="w-1/2">
            <Button
              className={disabled ? "border-[0.5px] border-black p-0" : ""}
              icon={
                <MoveRight
                  strokeWidth={1.3}
                  className={disabled ? "text-black" : ""}
                />
              }
              direction="right"
              buttonBgColor={disabled ? "bg-white" : "bg-black"}
              onClick={handleSubmit}
              disabled={disabled}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}
