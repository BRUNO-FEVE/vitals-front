import { motion } from "motion/react";
import React, { ReactNode } from "react";

import { Button } from "@/components/button";
import { QuizOption, useQuiz } from "@/contexts/quiz-context";
// import EmergencyButton from "../emergency-button";

interface SingleSelectionQuestionProps {
  question: ReactNode;
  options: QuizOption[];
}

export default function SingleSelectionQuestion({
  question,
  options,
}: SingleSelectionQuestionProps) {
  const { next } = useQuiz();

  const handleSelect = (value: string) => () => next(value);

  return (
    <>
      <h1 className="font-bold text-5xl h-24">{question}</h1>
      <div className="relative w-full h-full p-1 pb-20">
        <motion.div
          className="grid gap-4 w-full h-full py-12 overflow-y-scroll"
          initial={{ opacity: 0, y: "10%" }}
          animate={{ opacity: 1, y: "0%" }}
          transition={{ delay: 0, duration: 1, ease: "easeInOut" }}
        >
          {options.map((option) => (
            <Button
              key={option.value}
              label={option.label}
              direction="middle"
              onClick={handleSelect(option.value)}
              buttonBgColor="bg-black"
              contentBgColor="bg-white"
            />
          ))}
        </motion.div>
        <div
          className="absolute inset-0 pointer-events-none w-screen"
          style={{
            background:
              "linear-gradient(to bottom, white 5%, transparent 15%, transparent 80%, white 100%)",
          }}
        />
      </div>
      {/* <EmergencyButton /> */}
    </>
  );
}
