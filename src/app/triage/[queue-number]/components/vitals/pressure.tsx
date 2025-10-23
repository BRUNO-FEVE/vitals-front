"use client";

import { Button } from "@/components/button";
import { useQuiz } from "@/contexts/quiz-context";
import { motion } from "motion/react";
import React from "react";

export default function Pressure() {
  const { next } = useQuiz();

  const handleSubmit = () => {
    next("");
  };

  return (
    <>
      <motion.div
        className="flex flex-col justify-between h-full w-4/4 mt-6"
        initial={{ opacity: 0, y: "10%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ delay: 0, duration: 1, ease: "easeInOut" }}
      >
        <h1 className="font-bold text-5xl">Hora Pressão Arterial</h1>
      </motion.div>

      <div className="w-1/4 fixed right-5 bottom-5 z-30">
        <Button
          label="Continuar"
          direction="right"
          onClick={handleSubmit}
          buttonBgColor={"bg-black"}
          contentBgColor="bg-white"
        />
      </div>
    </>
  );
}
