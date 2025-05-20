import Slider from "@/components/slider";
import { motion } from "motion/react";
import React, { useEffect, useMemo, useState } from "react";
import EmergencyButton from "./emergency-button";
import { Button } from "@/components/button";
import { MoveRight } from "lucide-react";
import { useQuiz } from "@/contexts/quiz-context";

export default function PainLevelQuestion() {
  const [value, setValue] = useState<string>();
  const { next } = useQuiz();

  const POSSIBLE_ANSWERS: string[] = [
    "Sem dor",
    "Dor leve",
    "Dor moderada",
    "Dor forte",
    "Dor insuportável",
  ];

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (value && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [value, hasAnimated]);

  const disabled = useMemo(() => {
    return value === undefined;
  }, [value]);

  return (
    <>
      <motion.div
        className="flex flex-col justify-between h-full w-3/4 mt-6"
        initial={{ opacity: 0, y: "10%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ delay: 1.8, duration: 1, ease: "easeInOut" }}
      >
        <h1 className="font-bold text-5xl">Qual seu nível de dor?</h1>
        <Slider setValue={setValue} range={POSSIBLE_ANSWERS} />
        <div className="flex flex-row justify-end items-center">
          {value && (
            <motion.h1
              className="h-[80px] flex items-center justify-center w-1/2 font-light font-mono text-xl bg-black text-white px-4 py-4 text-center"
              initial={!hasAnimated ? { x: "100%" } : false}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {value}
            </motion.h1>
          )}
          <div className="w-1/2">
            <Button
              className={disabled ? "border-[0.5px] border-black p-0" : ""}
              icon={
                <MoveRight
                  strokeWidth={1.3}
                  className={disabled ? "text-black" : ""}
                />
              }
              direction="right"
              buttonBgColor={disabled ? "bg-white" : "bg-black"}
              onClick={next}
              disabled={disabled}
            />
          </div>
        </div>
      </motion.div>

      <EmergencyButton />
    </>
  );
}
