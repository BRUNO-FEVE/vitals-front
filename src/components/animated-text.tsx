"use client";

import { motion } from "motion/react";
import React from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  delayStep?: number;
  duration?: number;
}

export function AnimatedText({
  text,
  className = "",
  delay = 0,
  delayStep = 0.05,
  duration = 0.3,
}: AnimatedTextProps) {
  return (
    <span
      className={`inline-block overflow-hidden align-middle ${className}`}
      style={{ height: "1em" }}
    >
      {text.split("").map((letter, index) => (
        <motion.span
          key={letter + index}
          className="inline-block"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{
            duration,
            delay: index * delayStep + delay,
            ease: "easeInOut",
          }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}
