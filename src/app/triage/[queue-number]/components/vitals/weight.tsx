"use client";
import React, { useState } from "react";
import { useQuiz } from "@/contexts/quiz-context";
import { motion } from "motion/react";
import RangeWheel from "@/app/components/range-wheel";
import { Button } from "@/components/button";

const INITIAL_KG_VALUE = 75;

const KG_RANGE = {
  min: 30,
  max: 150,
};

export default function WeightVitals() {
  const [kg, setKg] = useState(INITIAL_KG_VALUE);

  const { next } = useQuiz();

  const handleSubmit = () => {
    console.log("Weight:", {
      kg,
    });

    next(kg.toString());
  };

  return (
    <>
      <motion.div
        className="flex flex-row justify-center items-center h-full w-3/4 -translate-x-10"
        initial={{ opacity: 0, y: "10%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ delay: 0, duration: 1, ease: "easeInOut" }}
      >
        <h1 className="font-bold text-5xl text-end">Qual o seu peso?</h1>
        <div className="w-fit flex flex-row items-center gap-2">
          <RangeWheel
            min={KG_RANGE.min}
            max={KG_RANGE.max}
            align="end"
            onChange={setKg}
            initialValue={INITIAL_KG_VALUE}
          />
          <span className="text-xl font-mono">kg</span>
        </div>
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
