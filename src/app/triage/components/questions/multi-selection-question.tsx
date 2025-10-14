import { motion } from "motion/react";
import React, { ReactNode, useState } from "react";

import { Button } from "@/components/button";
import { QuizOption, useQuiz } from "@/contexts/quiz-context";
// import EmergencyButton from "../emergency-button";

interface MultiSelectionQuestionProps {
  question: ReactNode;
  options: QuizOption[];
}

export default function MultiSelectionQuestion({
  question,
  options,
}: MultiSelectionQuestionProps) {
  const { next } = useQuiz();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (value: string) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const canProceed = selected.length > 0;

  const handleSubmit = () => {
    if (canProceed) {
      next(selected);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-5xl h-fit">{question}</h1>
        <p className="font-mono text-sm text-brand-accent">
          * Pode escolher mais de uma
        </p>
      </div>
      <div className="relative w-full h-full p-1 pb-20 flex flex-row gap-2 items-end">
        <motion.div
          className="grid gap-4 w-3/4 h-full py-12 overflow-y-scroll"
          initial={{ opacity: 0, y: "10%" }}
          animate={{ opacity: 1, y: "0%" }}
          transition={{ delay: 1.8, duration: 1, ease: "easeInOut" }}
        >
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <button
                key={option.value}
                className={`w-full h-20 border border-black transition-colors duration-150 ${
                  isSelected
                    ? "bg-black text-white"
                    : "bg-white hover:bg-black hover:text-white"
                }`}
                onClick={() => toggleOption(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </motion.div>
        <div
          className="absolute inset-0 pointer-events-none w-screen"
          style={{
            background:
              "linear-gradient(to bottom, white 5%, transparent 15%, transparent 80%, white 100%)",
          }}
        />
        <div className="w-[200px] fixed right-5 bottom-5">
          <Button
            label="Continuar"
            direction="right"
            onClick={handleSubmit}
            buttonBgColor={"bg-black"}
            contentBgColor="bg-white"
          />
        </div>
      </div>

      {/* <EmergencyButton /> */}
    </>
  );
}
