"use client";

import { Siren } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

export default function EmergencyButton() {
  return (
    <motion.div
      className="absolute right-0 bottom-0 w-24 h-5/6 flex flex-row items-start gap-2"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      transition={{ delay: 1.7, duration: 0.7, ease: "easeInOut" }}
    >
      <motion.p
        className="font-mono text-xs"
        initial={{ x: "230%" }}
        animate={{ x: 0 }}
        transition={{
          delay: 2.5,
          duration: 0.4,
          ease: "easeInOut",
          type: "spring",
          bounce: 0.4,
        }}
      >
        P <br />E <br />
        D <br /> I <br />R <br />
        <br /> A <br />
        J<br />U<br />D<br />A
      </motion.p>
      <button className="bg-brand-accent w-full h-full flex items-center justify-center z-30">
        <Siren className="text-white" strokeWidth={1} />
      </button>
    </motion.div>
  );
}
