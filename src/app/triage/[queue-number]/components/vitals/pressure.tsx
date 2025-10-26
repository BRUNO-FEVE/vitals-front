"use client";

import RangeWheel from "@/app/components/range-wheel";
import { Button } from "@/components/button";
import { useQuiz } from "@/contexts/quiz-context";
import { motion } from "motion/react";
import React, { useState } from "react";

const INITIAL_SIS_VALUE = 120;
const INITIAL_DIA_VALUE = 80;

const SIS_RANGE = {
  min: 70, // Min value for Systolic (mmHg)
  max: 200, // Max value for Systolic (mmHg)
};

const DIA_RANGE = {
  min: 40, // Min value for Diastolic (mmHg)
  max: 120, // Max value for Diastolic (mmHg)
};

export default function Pressure() {
  const [SISValue, setSISValue] = useState<number>(INITIAL_SIS_VALUE);
  const [DIAValue, setDIAValue] = useState<number>(INITIAL_DIA_VALUE);

  const { next } = useQuiz();

  const handleSubmit = () => {
    next(`${SISValue}/${DIAValue}`);
  };

  return (
    <>
      <motion.div
        className="flex flex-col-reverse justify-start h-full w-4/4 mt-6"
        initial={{ opacity: 0, y: "10%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ delay: 0, duration: 1, ease: "easeInOut" }}
      >
        <div className="absolute left-8 top-10 font-bold text-5xl z-20">
          <span className="pl-10">Pressão</span> <br /> <span>Arterial</span>
        </div>

        <div className="w-full h-full flex flex-col justify-center gap-0 -translate-y-5">
          <div className="translate-y-8 relative">
            <RangeWheel
              min={SIS_RANGE.min}
              max={SIS_RANGE.max}
              align="end"
              onChange={setSISValue}
              initialValue={INITIAL_SIS_VALUE}
              orientation="horizontal"
            />
            <div className="-z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-20 border border-brand-accent" />

            <p className="z-20 text-brand-accent font-mono italic text-base absolute -top-10 right-48 text-center">
              <span className="opacity-25 text-sm">(SIS)</span> <br /> sistólica
            </p>
          </div>
          <div className="relative">
            <RangeWheel
              min={DIA_RANGE.min}
              max={DIA_RANGE.max}
              align="end"
              onChange={setDIAValue}
              initialValue={INITIAL_DIA_VALUE}
              orientation="horizontal"
            />
            <div className="-z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-20 border border-brand-primary" />
            <p className="z-20 text-brand-primary font-mono italic text-base absolute -bottom-10 left-48 text-center">
              diastólica <br />{" "}
              <span className="opacity-25 text-sm">(DIA)</span>
            </p>
          </div>
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
