import { motion } from "motion/react";
import React, { useMemo } from "react";

import { useQuiz } from "@/contexts/quiz-context";
// import EmergencyButton from "../emergency-button";
import { QuizOption } from "@/contexts/quiz-context";

interface QuestionTemplateProps {
  question: string;
  options?: QuizOption[];
}

export default function YesOrNoQuestionTemplate({
  question,
  options,
}: QuestionTemplateProps) {
  const { next } = useQuiz();

  const availableOptions = useMemo<QuizOption[]>(() => {
    if (options && options.length > 0) {
      return options;
    }

    return [
      { value: "yes", label: "Sim" },
      { value: "no", label: "Não" },
    ];
  }, [options]);

  const handleSubmit = (value: string) => () => next(value);

  return (
    <>
      <h1 className="font-bold text-5xl min-h-24 h-fit">{question}</h1>
      <motion.div
        className="grid grid-cols-2 gap-4 w-3/4"
        initial={{ opacity: 0, y: "10%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ delay: 1.8, duration: 1, ease: "easeInOut" }}
      >
        {availableOptions.map((option) => (
          <button
            key={option.value}
            className="w-full h-20 border border-black hover:bg-black hover:text-white duration-150 transition-colors delay-75"
            onClick={handleSubmit(option.value)}
          >
            {option.label ?? option.value}
          </button>
        ))}
      </motion.div>
      {/* <EmergencyButton /> */}
    </>
  );
}
