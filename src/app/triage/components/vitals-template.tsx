"use client";

import React, { useEffect, useState } from "react";
import EmergencyButton from "./emergency-button";
import { cn } from "@/lib/utils";
import { useQuiz } from "@/contexts/quiz-context";
import { motion } from "motion/react";

interface VitalsTemplateProps {
  index: number;
}

export default function VitalsTemplate({ index }: VitalsTemplateProps) {
  const [progressPercentage, setProgressPercentage] = useState(0);
  const warning = false;
  const { next, currentIndex } = useQuiz();
  const isActive = currentIndex === index;

  useEffect(() => {
    if (!isActive) {
      setProgressPercentage(0);
      return;
    }

    const totalDuration = 10_000; // 60 seconds
    const tickInterval = 1_000; // update once per second
    const totalTicks = totalDuration / tickInterval;
    let tick = 0;

    const id = setInterval(() => {
      tick += 1;
      setProgressPercentage((tick / totalTicks) * 100);

      if (tick >= totalTicks) {
        clearInterval(id);

        setTimeout(() => {
          next();
        }, 1000); // 1 sec delay
      }
    }, tickInterval);

    return () => clearInterval(id);
  }, [next, isActive]);

  return (
    <div className="w-full h-full flex flex-row">
      <div className="pl-[100.5px] flex-grow bg-[url('/heart-beat.png')] bg-contain bg-start bg-no-repeat mt-7">
        <h1
          className={cn(
            warning ? "text-brand-accent" : "text-transparent",
            "font-mono text-sm pl-3 pb-3"
          )}
        >
          SENSOR PERDEU SINAL, POR FAVOR SE AJUSTE NA <br /> CADEIRA OU CHAME A
          INFERMEIRA
        </h1>

        <div
          className={cn(
            warning ? "border-brand-accent" : "border-black",
            "h-[90px] w-4/5 bg-white border border-l-0"
          )}
        >
          <motion.div
            className={cn(
              warning ? "bg-brand-accent" : "bg-black",
              "h-full border-l-0"
            )}
            initial={{ width: "0", opacity: 0 }}
            animate={{ width: `${progressPercentage}%`, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          />
        </div>

        <h1 className="font-bold text-3xl pl-5 pt-3">
          Medindo batimentos <br /> cardíacos oxigenação
        </h1>
        <p className="font-mono text-xs pl-5 pt-6">
          Por favor, aguarde{" "}
          <span className="font-bold text-brand-accent">parado</span> enquanto
          realizamos a medição...
        </p>
      </div>

      <EmergencyButton />
    </div>
  );
}
