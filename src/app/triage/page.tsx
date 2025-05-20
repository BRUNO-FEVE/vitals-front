"use client";

import { motion, Variants } from "motion/react";
import React, { ReactNode } from "react";
import { useQuiz } from "@/contexts/quiz-context";
import { cn } from "@/lib/utils";

export const anim: Variants = {
  hidden: {
    position: "absolute",
    display: "none",
    top: 0,
    left: 0,
    y: "100%",
    scale: 1,
    opacity: 1,
    zIndex: 0,
    transition: { duration: 0 },
  },
  waiting: {
    position: "relative",
    display: "flex",
    y: "0%",
    scale: 1,
    opacity: 1,
    zIndex: 10,
    transition: { delay: 0, duration: 0.7, ease: "easeInOut" },
  },
  slideUp: {
    position: "absolute",
    display: "flex",
    top: 0,
    left: 0,
    y: "-20%",
    scale: 0.9,
    opacity: 0.9,
    zIndex: 5,
    transition: { duration: 0.7, ease: "easeInOut" },
  },
};

export default function Page() {
  const { quizList, currentIndex } = useQuiz();

  return (
    <div
      className={cn(
        currentIndex !== 0 ? "bg-black" : "bg-brand-primary",
        "relative w-full h-full overflow-hidden overflow-x-hidden overflow-y-visible"
      )}
    >
      {quizList.map((unit: ReactNode, index) => (
        <motion.div
          key={index}
          className={cn(
            quizList.length - 1 === index ? "bg-black" : "bg-white",
            "w-screen h-[78vh] px-[10%] py-[5%] flex flex-col gap-4"
          )}
          variants={anim}
          initial="hidden"
          animate={
            index === currentIndex
              ? "waiting"
              : index < currentIndex
              ? currentIndex - index > 1
                ? "hidden"
                : "slideUp"
              : "hidden"
          }
        >
          {unit}
        </motion.div>
      ))}
    </div>
  );
}
