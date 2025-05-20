import { motion } from "motion/react";
import React, { ReactNode } from "react";
import EmergencyButton from "./emergency-button";
import { useQuiz } from "@/contexts/quiz-context";

interface QuestionTemplateProps {
  question: ReactNode;
}

export default function YesOrNoQuestionTemplate({
  question,
}: QuestionTemplateProps) {
  const { next } = useQuiz();

  return (
    <>
      <h1 className="font-bold text-5xl h-24">{question}</h1>
      <motion.div
        className="grid grid-cols-2 gap-4 w-3/4"
        initial={{ opacity: 0, y: "10%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ delay: 1.8, duration: 1, ease: "easeInOut" }}
      >
        <button
          className="w-full h-20 border border-black hover:bg-black hover:text-white duration-150 transition-colors delay-75"
          onClick={() => {
            next();
          }}
        >
          SIM
        </button>
        <button
          className="w-full h-20 border border-black hover:bg-black hover:text-white duration-150 transition-colors delay-75"
          onClick={next}
        >
          NÃO
        </button>
      </motion.div>
      <EmergencyButton />
    </>
  );
}
