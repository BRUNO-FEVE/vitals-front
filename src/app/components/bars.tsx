"use client";

import React from "react";
import { motion } from "motion/react";
import { topVariants, bottomVariants } from "./animationVariants";
import Keyboard from "@/components/keyboard";
import { useQueueNumber } from "@/contexts/password-context";

interface BarsProps {
  isInitial: boolean;
}

export const Bars: React.FC<BarsProps> = ({ isInitial }) => {
  const { queueNumber } = useQueueNumber();

  return (
    <>
      <motion.div
        className="w-full bg-white absolute top-0 z-0"
        variants={topVariants}
        initial="open"
        animate={isInitial ? "open" : "closed"}
        whileHover="hover"
        transition={{
          duration: queueNumber.length > 0 ? 0 : 0.5,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="w-full bg-white absolute bottom-0 z-10"
        variants={bottomVariants}
        initial="closed"
        animate={isInitial ? "closed" : "open"}
        transition={{ delay: 0.15, duration: 0.7, ease: "easeInOut" }}
      >
        {!isInitial && <Keyboard />}
      </motion.div>
    </>
  );
};
