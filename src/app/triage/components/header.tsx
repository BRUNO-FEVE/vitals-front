"use client";

import { useQuiz } from "@/contexts/quiz-context";
import { motion } from "motion/react";
import React from "react";

interface HeaderProps {
  patient: { name: string; dateOfBirth: string };
}

export default function Header({ patient }: HeaderProps) {
  const { currentIndex, quizList } = useQuiz();

  return (
    <motion.div
      className="relative z-20 bg-brand-primary flex flex-col gap-2 font-sans text-white py-2 h-[22vh]"
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <div className="flex flex-row justify-between items-center px-[10%]">
        <h1 className="font-mono font-normal">TRIAGEM</h1>
        <p className="text-sm font-sans font-extralight">
          Etapa {currentIndex} de {quizList.length}
        </p>
      </div>
      <motion.div
        className="h-[1px] w-full bg-white"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ delay: 0.7, duration: 0.7, ease: "easeInOut" }}
      >
        <motion.div
          className="h-[3px] bg-white rounded-2xl -translate-y-[1px]"
          initial={{ x: "-100%", width: "30%" }}
          animate={{ x: 0, width: "10%" }}
          transition={{
            delay: 1.5,
            duration: 0.7,
            ease: "easeInOut",
            type: "tween",
            bounce: 0.5,
          }}
        />
      </motion.div>
      <div>
        <h1 className="text-white px-[10%]">{patient.name}</h1>
        <p className="text-sm font-sans font-extralight px-[10%]">
          {patient.dateOfBirth}
        </p>
      </div>
    </motion.div>
  );
}
