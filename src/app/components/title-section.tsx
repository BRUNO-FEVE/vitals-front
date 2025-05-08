"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { senhaLabelVariants } from "./animationVariants";

interface TitleSectionProps {
  stage: "INITIAL" | "IDENTIFY";
  senhaLabelVariant: "hidden" | "open" | "outOfFocus";
  animationDuration: number;
  password: string;
}

export const TitleSection: React.FC<TitleSectionProps> = ({
  stage,
  senhaLabelVariant,
  animationDuration,
  password,
}) => {
  const isInitial = stage === "INITIAL";

  return (
    <div
      className={`w-screen relative flex flex-col justify-end ${
        isInitial
          ? "h-3/5 items-start pb-10 px-[10%]"
          : "h-1/2 items-start pb-7.5 px-[5%]"
      }`}
    >
      <div className="h-fit z-10">
        <p
          className={`font-mono pl-1 delay-[1.8] ${
            stage === "IDENTIFY" ? "hidden" : "text-primary text-sm"
          }`}
        >
          TRIAGEM
        </p>
        {isInitial && (
          <motion.h1
            key="initial-title"
            className="text-7xl font-sans font-semibold"
          >
            Insira seu <br /> número de espera!
          </motion.h1>
        )}

        <AnimatePresence>
          {!isInitial && (
            <motion.h1
              key="identify-title"
              variants={senhaLabelVariants}
              initial="hidden"
              animate={senhaLabelVariant}
              exit="hidden"
              custom={animationDuration}
              className="text-white font-semibold"
            >
              SENHA DE ESPERA{senhaLabelVariant === "outOfFocus" ? "" : "..."}
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      <h1
        className={`${
          isInitial ? "hidden" : "absolute"
        } h-fit right-3 bottom-0 top-0 my-auto text-[200px] text-white font-bold z-0`}
      >
        {password}
      </h1>
      {/* <h1
        className={`$${
          isInitial ? "hidden" : "absolute"
        } h-fit right-3 bottom-0 top-0 my-auto text-[200px] text-white font-bold z-0 flex gap-2`}
        style={{ letterSpacing: "0.1em" }}
      >
        <AnimatePresence initial={false}>
          {password.split("").map((digit, idx) => (
            <motion.span
              key={digit + idx}
              initial={{ scale: 0.7, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: -40 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="inline-block"
            >
              {digit}
            </motion.span>
          ))}
        </AnimatePresence>
      </h1> */}
    </div>
  );
};
