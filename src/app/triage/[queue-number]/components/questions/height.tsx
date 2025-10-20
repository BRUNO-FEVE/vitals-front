"use client";

import RangeWheel from "@/app/components/range-wheel";
import { Button } from "@/components/button";
import { useQuiz } from "@/contexts/quiz-context";
import { motion } from "motion/react";
import React, { useState } from "react";

const INITIAL_METERS_VALUE = 1;
const INITIAL_CENTIMETERS_VALUE = 75;

const METERS_RANGE = {
  min: 0,
  max: 2,
};

const CENTIMETERS_RANGE = {
  min: 0,
  max: 99,
};

export default function Height() {
  const [meters, setMeters] = useState(INITIAL_METERS_VALUE);
  const [centimeters, setCentimeters] = useState(INITIAL_CENTIMETERS_VALUE);

  const { next } = useQuiz();

  const totalHeightInCm = meters * 100 + centimeters;
  const totalHeightInMeters = (totalHeightInCm / 100).toFixed(2);

  const handleSubmit = () => {
    console.log("Height:", {
      meters,
      centimeters,
      totalCm: totalHeightInCm,
      totalMeters: totalHeightInMeters,
    });

    next(totalHeightInCm.toString());
  };

  return (
    <>
      <motion.div
        className="flex flex-row justify-center items-center h-full w-3/4"
        initial={{ opacity: 0, y: "10%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ delay: 0, duration: 1, ease: "easeInOut" }}
      >
        <h1 className="font-bold text-5xl text-end">Qual a sua altura?</h1>
        <div className="w-fit flex flex-row items-center gap-2">
          <RangeWheel
            min={METERS_RANGE.min}
            max={METERS_RANGE.max}
            align="end"
            onChange={setMeters}
            initialValue={INITIAL_METERS_VALUE}
          />
          <span className="text-xl font-mono">m</span>
          <RangeWheel
            min={CENTIMETERS_RANGE.min}
            max={CENTIMETERS_RANGE.max}
            align="end"
            onChange={setCentimeters}
            initialValue={INITIAL_CENTIMETERS_VALUE}
          />
          <span className="text-xl font-mono">cm</span>
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
