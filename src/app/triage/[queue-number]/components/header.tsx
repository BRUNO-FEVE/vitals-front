"use client";
import { useQuiz } from "@/contexts/quiz-context";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import React from "react";
import { ChevronLeft } from "lucide-react";

export default function Header() {
  const { currentIndex, quizList, prev, user } = useQuiz();
  const pathname = usePathname();

  // Check if we should show the header
  const shouldShowHeader = pathname ? !pathname.includes("/results") : true;

  // --- PROGRESS BAR LOGIC ---
  // Assuming currentIndex is 0-indexed (0, 1, 2, ...)
  // Add 1 to currentIndex for correct step number and percentage calculation
  const currentStep = currentIndex + 1;
  const totalSteps = quizList.length;
  // Calculate the percentage width for the progress bar
  const progressWidth = `${(currentStep / totalSteps) * 100}%`;
  // --- END LOGIC ---

  const formattedDate = user
    ? new Date(user.dateOfBirth).toLocaleDateString("pt-BR")
    : "Carregando...";

  return (
    <AnimatePresence mode="wait">
      {shouldShowHeader && (
        <motion.div
          className="relative z-20 bg-brand-primary flex flex-col gap-2 font-sans text-white py-2 h-[22vh]"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="flex flex-row justify-between items-center px-[10%]">
            <h1 className="font-mono font-normal">TRIAGEM</h1>
            <p className="text-sm font-sans font-extralight">
              Etapa {currentStep} de {totalSteps}
            </p>
          </div>
          <motion.div
            className="h-[1px] w-full bg-white"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeInOut" }}
          >
            <motion.div
              className="h-[3px] bg-white rounded-2xl -translate-y-[1px]"
              style={{ width: progressWidth }}
              initial={{ width: "0%" }}
              animate={{ width: progressWidth }}
              transition={{
                delay: 0.3,
                duration: 0.7,
                ease: "easeInOut",
                type: "tween",
              }}
            />
          </motion.div>
          <div className="flex flex-row px-[4%] justify-start items-center gap-2 -translate-x-6">
            <button
              className={`${
                currentIndex !== 0 ? "opacity-100" : "opacity-0"
              } flex items-center justify-center hover:bg-white hover:text-brand-primary border border-white h-full w-[9%]`}
              onClick={prev}
            >
              <ChevronLeft size={20} strokeWidth={1} />
            </button>
            <div className="flex flex-col gap-0">
              <h1 className="text-white">
                {user ? user.name : "Carregando..."}
              </h1>
              <p className="text-sm font-sans font-extralight">
                {formattedDate}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
